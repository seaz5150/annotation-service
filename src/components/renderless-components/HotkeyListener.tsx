import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/Index";
import { useEffect, useRef } from "react";

// Component used for listening for key shortcuts and dispatching related actions.
const HotkeyListener = () => {
    const dispatch = useDispatch();
    const { createActionTranscriptSaveChanges,
            createActionTranscriptGatherSplitInfo,
            createActionTranscriptSplitSegment,
            createActionTranscriptUpdateWords,
            createActionEditorReinitializeWords,
            createActionHistoryUndoAction, 
            createActionHistoryRedoAction,
            createActionHistoryAddAction,
            createActionTranscriptPlayerAddAction,
            createActionEditorRequestDataSave,
            createActionAudioTogglePlay,
            createActionEditorAddSectionTag, 
            createActionEditorAddUnpairedTag} = bindActionCreators(actionCreators, dispatch);
    const hotkey = useSelector((state: any) => state.hotkey);
    const transcript = useSelector((state: any) => state.recordingTranscript);
    
    var event2string = require('key-event-to-string')({cmd: "Ctrl/Cmd", ctrl: "Ctrl/Cmd"});

    const hotkeyRebindInProgress = useRef(false);
    const saveHotkey = useRef("");
    const splitHotkey = useRef("");
    const undoHotkey = useRef("");
    const redoHotkey = useRef("");
    const togglePlayHotkey = useRef("");
    const tagSelectionHotkeys = useRef([]);

    const splitCompleted = useRef(false);
    const splitSegmentBefore = useRef<any>();
    const splitSegmentAfter = useRef<any>();
    const splitSegmentAdded = useRef<any>();

    useEffect(() => {
        saveHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "SAVE").hotkey;
        splitHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "SPLIT").hotkey;
        undoHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "UNDO").hotkey;
        redoHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "REDO").hotkey;
        togglePlayHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "TOGGLE_PLAY").hotkey;
        tagSelectionHotkeys.current = hotkey.hotkeys.filter((h: { tagHotkey: boolean; }) => h.tagHotkey === true);
    }, [hotkey.hotkeys]);

    useEffect(() => {
        hotkeyRebindInProgress.current = hotkey.rebindInProgress;
    }, [hotkey.rebindInProgress]);

    useEffect(() => {
        splitSegmentBefore.current = transcript.segmentToSplit;
    }, [transcript.segmentToSplit]);

    useEffect(() => {
        splitCompleted.current = transcript.splitCompleted;
    }, [transcript.splitCompleted]);

    useEffect(() => {
        splitSegmentAfter.current = transcript.segmentAfterSplit;
    }, [transcript.segmentAfterSplit]);

    useEffect(() => {
        splitSegmentAdded.current = transcript.addedSplitSegment;
    }, [transcript.addedSplitSegment]);

    useEffect(() => {
        document.addEventListener('keydown', OnKeyDown);
    }, []);

    const OnKeyDown = (e: any) => {
        if (!hotkeyRebindInProgress.current) {
            let keyString = event2string(e);
            if (keyString === saveHotkey.current) {
                e.preventDefault();
                createActionTranscriptSaveChanges();
            }
            else if (keyString === splitHotkey.current) {
                e.preventDefault();
                createActionTranscriptGatherSplitInfo();

                setTimeout(() => {
                    createActionTranscriptUpdateWords();
                    setTimeout(() => {
                        createActionTranscriptSplitSegment();
                        setTimeout(() => {
                            // Split was completed
                            if (splitCompleted.current) {
                                createActionHistoryAddAction("AnnotationTextSegment", splitSegmentBefore.current.id);
                                createActionTranscriptPlayerAddAction("SPLIT", splitSegmentBefore.current, splitSegmentAfter.current, splitSegmentAdded.current);
                                createActionEditorRequestDataSave(splitSegmentBefore.current.id);
                                setTimeout(() => {createActionEditorReinitializeWords([splitSegmentBefore.current.id]);}, 10);
                            }
                        }, 10);
                    }, 10);
                }, 10);
            }
            else if (keyString === undoHotkey.current) {
                e.preventDefault();
                createActionHistoryUndoAction();
            }
            else if (keyString === redoHotkey.current) {
                e.preventDefault();
                createActionHistoryRedoAction();
            }
            else if (keyString === togglePlayHotkey.current) {
                e.preventDefault();
                createActionAudioTogglePlay();
            }
            else if (tagSelectionHotkeys.current.find((h: {hotkey: string}) => h.hotkey === keyString) != null) {
                var tag = (tagSelectionHotkeys.current.find((h: { hotkey: string; }) => h.hotkey === keyString) as any);
                e.preventDefault();
                if (tag.unpairedTag === false) {
                    createActionEditorAddSectionTag(tag.name);
                }
                else {
                    createActionEditorAddUnpairedTag(tag.name);
                }
            }
        }
    }

    return null;
}
 
export default HotkeyListener;
