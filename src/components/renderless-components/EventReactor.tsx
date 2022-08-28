import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/Index";
import { useEffect, useRef } from "react";
import { createHttpsRequest } from "../../utils/ApiRequests";

// Component used for chaining events.
const EventReactor = () => {
    const dispatch = useDispatch();
    const { createActionTranscriptPlayerRedoAction,
            createActionTranscriptPlayerUndoAction,
            createActionEditorRequestDataSave,
            createActionEditorReinitializeWordsFromSaved,
            createActionEditorReinitializeWords,
            createActionTranscriptSetSaveActionIndex,
            createActionTranscriptUpdateWords,
            createActionTranscriptConstructFullTranscript } = bindActionCreators(actionCreators, dispatch);

    const history = useSelector((state: any) => state.history);
    const transcript = useSelector((state: any) => state.recordingTranscript);
    const job = useSelector((state: any) => state.job);

    const transcriptRef = useRef<any>();

    useEffect(() => {
      switch (job.type) {
        case "JOB_NEXT":
        case "JOB_PREVIOUS":
          var newJobId = job.jobId;
          window.location.href="/" + newJobId;
          break;
      }
    }, [job]);

    useEffect(() => {
      transcriptRef.current = transcript;
    }, [transcript]);

    // The history undo and redo events can also be used to perform actions before the undo/redo happens, like saving editor data etc.
    // Need to keep in mind that the action history index in the other reducer won't yet be updated though and needs to be adjusted accordingly if necessary.
    useEffect(() => {
        switch (history.type) {
          case "HISTORY_REDO_ACTION":
            var historyItem = history.actionHistory[history.currentActionIndex];
            if (historyItem.componentName === "AudioPlayer") {
              createActionTranscriptPlayerRedoAction();
            }
            if (historyItem.componentName === "AnnotationTextSegment") {
              var currentHistoryAction = transcript.playerActionHistory[transcript.playerActionHistoryIndex + 1]; 
              switch (currentHistoryAction.type) {
                case "MERGE":
                  createActionEditorRequestDataSave(currentHistoryAction.additionalSegment.id);
                  setTimeout(() => {createActionTranscriptPlayerRedoAction()}, 10);
                  break;
                case "REMOVE":
                  createActionEditorRequestDataSave(currentHistoryAction.segmentBefore.id);
                  setTimeout(() => {createActionTranscriptPlayerRedoAction()}, 10);
                  break;
                default:
                  createActionTranscriptPlayerRedoAction();
                  break;
              }
            }
            break;
          case "HISTORY_UNDO_ACTION":
            var historyItem = history.actionHistory[history.currentActionIndex + 1];
            if (historyItem.componentName === "AudioPlayer") {
              // We could be undoing the creation of a segment, so save the editor history first.
              createActionEditorRequestDataSave(historyItem.segmentId);
              setTimeout(() => {createActionTranscriptPlayerUndoAction()}, 10);
            }
            if (historyItem.componentName === "AnnotationTextSegment") {
              createActionTranscriptPlayerUndoAction();
            }
            break;
        }
      }, [history]);

      useEffect(() => {
        switch (transcript.type) {
          case "TRANSCRIPT_SAVE_CHANGES":
            createActionTranscriptSetSaveActionIndex(history.currentActionIndex);
            createActionTranscriptUpdateWords();
            setTimeout(() => {
                createActionTranscriptConstructFullTranscript();
                setTimeout(() => {
                  saveJobTranscript(job.jobId, JSON.stringify(transcriptRef.current.fullTranscript, null, 2));
                }, 10)
            }, 10);
            break;
        }
      }, [transcript]);

      const saveJobTranscript = async (jobId: string, transcriptData: any) => {
        var requestReturn;
        let request = "jobs/" + jobId + "/transcript";
      
        requestReturn = await createHttpsRequest({data: transcriptData}, request, "PUT");
        if (requestReturn.status !== 200) {
          console.error("ERROR", requestReturn);
          return;
        }
      }

      useEffect(() => {
        switch (transcript.type) {
            case "TRANSCRIPT_PLAYER_UNDO_ACTION":
                var currentHistoryAction = transcript.playerActionHistory[transcript.playerActionHistoryIndex + 1];
                if (currentHistoryAction.type === "MERGE") {
                  createActionEditorReinitializeWordsFromSaved([currentHistoryAction.segmentAfter.id, currentHistoryAction.additionalSegment.id]);
                }
                else if (currentHistoryAction.type === "SPLIT") {
                  createActionEditorReinitializeWordsFromSaved([currentHistoryAction.segmentAfter.id]);
                }
                break;
            case "TRANSCRIPT_PLAYER_REDO_ACTION":
                var currentHistoryAction = transcript.playerActionHistory[transcript.playerActionHistoryIndex];
                if (currentHistoryAction.type === "MERGE") {
                  createActionEditorRequestDataSave(currentHistoryAction.segmentAfter.id);
                  setTimeout(() => {createActionEditorReinitializeWords([currentHistoryAction.segmentAfter.id])}, 10);
                }
                else if (currentHistoryAction.type === "SPLIT") {
                  createActionEditorReinitializeWords([currentHistoryAction.segmentAfter.id]);
                }
                break;
        }
    }, [transcript]);

    return null;
}
 
export default EventReactor;
