import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state";
import { useEffect } from "react";

const EventReactor = () => {
    const dispatch = useDispatch();
    const { createActionTranscriptPlayerRedoAction,
            createActionTranscriptPlayerUndoAction,
            createActionEditorRequestDataSave,
            createActionEditorReinitializeWordsFromSaved,
            createActionEditorReinitializeWords } = bindActionCreators(actionCreators, dispatch);

    const history = useSelector((state: any) => state.history);
    const transcript = useSelector((state: any) => state.recordingTranscript);

    useEffect(() => {
        switch (history.type) {
          case "HISTORY_REDO_ACTION":
            var historyItem = history.actionHistory[history.currentActionIndex];
            if (historyItem.componentName === "AudioPlayer") {
              createActionTranscriptPlayerRedoAction();
            }
            if (historyItem.componentName === "AnnotationSegment") {
              createActionTranscriptPlayerRedoAction();
            }
            break;
          case "HISTORY_UNDO_ACTION":
            var historyItem = history.actionHistory[history.currentActionIndex + 1];
            if (historyItem.componentName === "AudioPlayer") {
              // We could be undoing the creation of a segment, so save the editor history first.
              createActionEditorRequestDataSave(historyItem.segmentId);
              setTimeout(() => {createActionTranscriptPlayerUndoAction()}, 10);
            }
            if (historyItem.componentName === "AnnotationSegment") {
              createActionTranscriptPlayerUndoAction();
            }
            break;
        }
      }, [history]);

      useEffect(() => {
        switch (transcript.type) {
            case "TRANSCRIPT_PLAYER_UNDO_ACTION":
                var currentHistoryAction = transcript.playerActionHistory[transcript.playerActionHistoryIndex + 1];
                if (currentHistoryAction.type === "MERGE") {
                    createActionEditorReinitializeWordsFromSaved([currentHistoryAction.segmentAfter.id, currentHistoryAction.mergeSourceSegment.id]);
                }
                break;
            case "TRANSCRIPT_PLAYER_REDO_ACTION":
                var currentHistoryAction = transcript.playerActionHistory[transcript.playerActionHistoryIndex];
                if (currentHistoryAction.type === "MERGE") {
                    createActionEditorRequestDataSave(currentHistoryAction.segmentAfter.id);
                    setTimeout(() => { createActionEditorReinitializeWords([currentHistoryAction.segmentAfter.id])}, 10);
                }
                break;
        }
    }, [transcript]);

    return null;
}
 
export default EventReactor;
