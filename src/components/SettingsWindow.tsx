import { bindActionCreators } from "@reduxjs/toolkit";
import { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface SettingsWindowInterface {
    settingsExpanded: boolean
}

const SettingsWindow = (props: SettingsWindowInterface) => {
    const dashboard = useSelector((state: any) => state.dashboard);
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule, 
            createActionDashboardResetLayout, 
            createActionAudioPlaySetPreplay,
            createActionTranscriptSegmentsShift } = bindActionCreators(actionCreators, dispatch);

    const audioPlay = useSelector((state: any) => state.audioPlay);
    
    const [shiftAmount, setShiftAmount] = useState(0);

    const toggleModule = (e: React.ChangeEvent<HTMLInputElement>, moduleName: string) => {
        createActionDashboardToggleModule(moduleName, e.target.checked);
    }

    return (  
        <div className={"settings-window ms-auto me-auto" + (props.settingsExpanded ? " settings-window-expand" : "")}>
            <div className="card-header d-flex justify-content-between">
                Settings
            </div>
            <div className="row mt-2 ms-4 me-4">
                <div className="settings-column col">
                    <p className="title-small pb-1">Shortcuts</p>
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
                        <button className="text-tag-button btn-secondary custom-dropdown save-button add-label-button" 
                                onMouseDown={pressStopPropagation}>
                                <div className="d-flex align-items-center justify-content-center">
                                    <i className="bi bi-lock-fill me-1"></i>
                                    Lock layout
                                </div>
                        </button>
                    </div>
                </div>
                <div className="settings-column col">
                    <p className="title-small pb-1">Misc</p>
                    <div className="mx-2">
                        <span className="title-small fw-normal mb-1 d-flex justify-content-between">
                            Pre-play (s):
                            <input className="misc-input" type="number" min="0" step="0.1" value={audioPlay.prePlay} onChange={(e) => createActionAudioPlaySetPreplay(Number(e.target.value))}></input>
                        </span>
                        <span className="title-small fw-normal d-flex justify-content-between">
                            Time shift (s):
                            <span>
                                <input className="misc-input me-1" type="number" step="0.01" value={shiftAmount} onChange={(e) => setShiftAmount(Number(e.target.value))}></input>
                                <button className="text-tag-button btn-secondary job-control-done-button shift-button" onClick={() => createActionTranscriptSegmentsShift(shiftAmount)}>
                                    <i className="bi bi-check-lg"></i>
                                </button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default SettingsWindow;
