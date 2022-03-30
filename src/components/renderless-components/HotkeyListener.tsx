import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state";
import { useEffect, useRef } from "react";

const HotkeyListener = () => {
    const dispatch = useDispatch();
    const { createActionJobSaveChanges,
            createActionTranscriptGatherSplitInfo,
            createActionTranscriptSplitSegment,
            createActionTranscriptUpdateWords,
            createActionEditorReinitializeWords } = bindActionCreators(actionCreators, dispatch);
    const hotkey = useSelector((state: any) => state.hotkey);
    const transcript = useSelector((state: any) => state.recordingTranscript);
    
    var event2string = require('key-event-to-string')({cmd: "Ctrl/Cmd", ctrl: "Ctrl/Cmd"});

    const hotkeyRebindInProgress = useRef(false);
    const saveHotkey = useRef("");
    const splitHotkey = useRef("");

    const splitSegmentId = useRef("");

    useEffect(() => {
        saveHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "SAVE").hotkey;
        splitHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "SPLIT").hotkey;
    }, [hotkey.hotkeys]);

    useEffect(() => {
        hotkeyRebindInProgress.current = hotkey.rebindInProgress;
    }, [hotkey.rebindInProgress]);

    useEffect(() => {
        splitSegmentId.current = transcript.splitPlayerSegmentId;
    }, [transcript.splitPlayerSegmentId]);

    useEffect(() => {
        document.addEventListener('keydown', OnKeyDown);
    }, []);

    const OnKeyDown = (e: any) => {
        if (!hotkeyRebindInProgress.current) {
            let keyString = event2string(e);
            if (keyString === saveHotkey.current) {
                e.preventDefault();
                createActionJobSaveChanges();
            }
            else if (keyString === splitHotkey.current) {
                e.preventDefault();
                createActionTranscriptGatherSplitInfo();
                setTimeout(() => {
                    createActionTranscriptUpdateWords();
                    setTimeout(() => {
                        createActionTranscriptSplitSegment();
                        setTimeout(() => {createActionEditorReinitializeWords([splitSegmentId.current]);}, 10);
                    }, 10);
                }, 10);
            }
        }
    }

    return null;
}
 
export default HotkeyListener;
