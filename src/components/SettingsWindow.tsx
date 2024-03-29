import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pressStopPropagation } from "../utils/CommonUtilities";
import { actionCreators } from "../state/Index";

interface SettingsWindowInterface {
    settingsExpanded: boolean
}

const SettingsWindow = (props: SettingsWindowInterface) => {
    const dashboard = useSelector((state: any) => state.dashboard);
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule, 
            createActionDashboardResetLayout, 
            createActionAudioPlaySetPreplay,
            createActionTranscriptSegmentsShift,
            createActionTranscriptSetAutosaveInterval,
            createActionTranscriptToggleAutosave,
            createActionHotkeySet,
            createActionHotkeySetRebindInProgress,
            createActionHotkeyReset } = bindActionCreators(actionCreators, dispatch);

    const audioPlay = useSelector((state: any) => state.audioPlay);
    const transcript = useSelector((state: any) => state.recordingTranscript);
    const hotkey = useSelector((state: any) => state.hotkey);
    
    const [shiftAmount, setShiftAmount] = useState(0);
    const [autosaveInterval, setAutosaveInterval] = useState(transcript.autosaveInterval / 1000);

    const activeHotkeyRef = useRef("");
    const [hotkeyActive, setHotkeyActive] = useState(false);

    var event2string = require('key-event-to-string')({cmd: "Ctrl/Cmd", ctrl: "Ctrl/Cmd"});

    const toggleModule = (e: React.ChangeEvent<HTMLInputElement>, moduleName: string) => {
        createActionDashboardToggleModule(moduleName, e.target.checked);
    }

    useEffect(() => {
        createActionTranscriptSetAutosaveInterval(autosaveInterval * 1000);
    }, [autosaveInterval]);

    const updateAutosaveInterval = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = Number(e.target.value);
        if (newValue < 10) {
            newValue = 10;
        }
        setAutosaveInterval(newValue);
    }

    const OnKeyDown = (e: any) => {
        if (activeHotkeyRef.current !== "") {
            e.preventDefault();
            createActionHotkeySet(activeHotkeyRef.current, event2string(e));
        }
    }

    useEffect(() => {
        createActionHotkeySetRebindInProgress(hotkeyActive);
    }, [hotkeyActive]);

    useEffect(() => {
        document.addEventListener('keydown', OnKeyDown);
    }, []);

    return (  
        <div className={"settings-window ms-auto me-auto" + (props.settingsExpanded ? " settings-window-expand" : "")}>
            <div className="card-header d-flex justify-content-between">
                Settings
            </div>
            <div className="row mt-2 ms-4 me-4">
                <div className="settings-column col">
                    <p className="title-small pb-1">Shortcuts</p>
                    <div className="settings-modules-container ms-2 me-2">
                            {hotkey.hotkeys.map((h: { label: string; hotkey: string; name: string }) => 
                                <div key={h.name} className="d-flex pb-1 justify-content-between align-items-center">
                                    <p className="title-small fw-normal">{h.label}</p>
                                    <button className="badge strip-button-style bg-secondary hotkey-button me-1"
                                            onFocus={() => {activeHotkeyRef.current = h.name; setHotkeyActive(true)}}
                                            onBlur={() => {activeHotkeyRef.current = ""; setHotkeyActive(false)}}>
                                        {h.hotkey}
                                    </button>
                                </div>
                            )}
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button className="text-tag-button btn-secondary custom-dropdown save-button add-label-button " 
                                onMouseDown={pressStopPropagation}
                                onClick={createActionHotkeyReset}>
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    Reset hotkeys
                                </div>
                        </button>
                    </div>
                </div>
                <div className="settings-column col ms-4 me-4">
                    <p className="title-small pb-1">Layout</p>
                    <div className="settings-modules-container ms-2 me-2">
                        {dashboard.allModules.filter((m: { name: string, viewName?: string }) => m.viewName !== undefined).map((m: { name: string, viewName?: string }) => 
                            <div key={m.name} className="d-flex pb-1">
                                <p className="title-small fw-normal">{m.viewName}</p>
                                <input className="form-check-input custom-checkbox ms-auto me-2" 
                                       type="checkbox"
                                       onMouseDown={e => pressStopPropagation(e)} 
                                       onChange={(e) => toggleModule(e, m.name)}
                                       checked={dashboard.openModules ? dashboard.openModules.some((om: string) => om === m.name) : false}/>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button className="text-tag-button btn-secondary custom-dropdown save-button add-label-button " 
                                onMouseDown={pressStopPropagation}
                                onClick={createActionDashboardResetLayout}>
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    Reset layout
                                </div>
                        </button>
                        {/* <button className="text-tag-button btn-secondary custom-dropdown save-button add-label-button" 
                                onMouseDown={pressStopPropagation}
                                onClick={() => createActionDashboardToggleLockLayout()}>
                                <div className="d-flex align-items-center justify-content-center">
                                    {dashboard.lockLayout ?
                                        <>
                                            <i className="bi bi bi-unlock-fill me-1"></i>
                                            Unlock layout
                                        </>
                                    :
                                        <>
                                            <i className="bi bi-lock-fill me-1"></i>
                                            Lock layout
                                        </>
                                    }
                                </div>
                        </button> */}
                    </div>
                </div>
                <div className="settings-column col">
                    <p className="title-small pb-1">Misc</p>
                    <div className="mx-2">
                        <span className="title-small fw-normal mb-1 d-flex justify-content-between">
                            Pre-play (s):
                            <input className="misc-input" type="number" min="0" step="0.1" value={audioPlay.prePlay} onChange={(e) => createActionAudioPlaySetPreplay(Number(e.target.value))}></input>
                        </span>
                        <span className="title-small fw-normal mb-1 d-flex justify-content-between">
                            Time shift (s):
                            <span>
                                <input className="misc-input me-1" type="number" step="0.01" value={shiftAmount} onChange={(e) => setShiftAmount(Number(e.target.value))}></input>
                                <button className="text-tag-button btn-secondary custom-dropdown shift-button" onClick={() => createActionTranscriptSegmentsShift(shiftAmount)}>
                                    <i className="bi bi-arrow-right-short me-1"></i>
                                    Shift
                                </button>
                            </span>
                        </span>
                        <div className="d-flex pb-1">
                                <p className="title-small fw-normal">Autosave enabled:</p>
                                <input className="form-check-input custom-checkbox ms-auto me-2" 
                                       type="checkbox"
                                       onMouseDown={e => pressStopPropagation(e)} 
                                       onChange={(e) => createActionTranscriptToggleAutosave(e.target.checked)}
                                       checked={transcript.autosaveEnabled}/>
                        </div>
                        <span className={"title-small fw-normal mb-1 d-flex justify-content-between" + (!transcript.autosaveEnabled ? " disabled" : "")}>
                            Autosave interval (s):
                            <span>
                                <input className="misc-input me-1"
                                       type="number" min="10" step="1"
                                       value={autosaveInterval} 
                                       onChange={(e) => updateAutosaveInterval(e)}
                                       disabled={!transcript.autosaveEnabled}>
                                </input>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SettingsWindow;
