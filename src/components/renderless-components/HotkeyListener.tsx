import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state";
import { useEffect, useRef } from "react";

const HotkeyListener = () => {
    const dispatch = useDispatch();
    const { createActionJobSaveChanges } = bindActionCreators(actionCreators, dispatch);
    const hotkey = useSelector((state: any) => state.hotkey);
    
    var event2string = require('key-event-to-string')({cmd: "Ctrl/Cmd", ctrl: "Ctrl/Cmd"});

    const hotkeyRebindInProgress = useRef(false);
    const saveHotkey = useRef("");

    useEffect(() => {
        saveHotkey.current = hotkey.hotkeys.find((h: { name: string; }) => h.name === "SAVE").hotkey;
    }, [hotkey.hotkeys]);

    useEffect(() => {
        hotkeyRebindInProgress.current = hotkey.rebindInProgress;
    }, [hotkey.rebindInProgress]);

    useEffect(() => {
        document.addEventListener('keydown', OnKeyDown);
    }, []);

    const OnKeyDown = (e: any) => {
        if (!hotkeyRebindInProgress.current) {
            if (event2string(e) === saveHotkey.current) {
                e.preventDefault();
                createActionJobSaveChanges();
            }
        }
    }

    return null;
}
 
export default HotkeyListener;
