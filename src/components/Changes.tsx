import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { bindActionCreators } from "redux";
import { pressStopPropagation } from "../utils/CommonUtilities";
import { actionCreators } from "../state/Index";

interface ChangesInterface {
    updateElementGridSize: any,
    size: any
}

const Changes = (props: ChangesInterface) => {
    const dispatch = useDispatch();
    const { createActionHistoryUndoAction, 
            createActionHistoryRedoAction, 
            createActionDashboardToggleModule,
            createActionTranscriptSaveChanges,
            createActionTranscriptUpdateWords,
            createActionTranscriptConstructFullTranscript } = bindActionCreators(actionCreators, dispatch);
    const history = useSelector((state: any) => state.history);
    const hotkey = useSelector((state: any) => state.hotkey);
    const transcript = useSelector((state: any) => state.recordingTranscript);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [timeSinceSaveString, setTimeSinceSaveString] = useState("");
    const [timeSinceSaveColor, setTimeSinceSaveColor] = useState("text-success");
    const timeSinceSaveTimer = useRef<any>();
    const autosaveSaveTimer = useRef<any>();
    const transcriptRef = useRef<any>();

    const { width, height } = props.size;

    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    const downloadTranscript = () => {
        createActionTranscriptUpdateWords();
        setTimeout(() => {
            createActionTranscriptConstructFullTranscript();
            setTimeout(() => {
                // Inspired by https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
                var transcriptUri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transcriptRef.current.fullTranscript, null, 2));
                var dlAnchorElem = document.getElementById('downloadAnchor');
                dlAnchorElem?.setAttribute("href", transcriptUri);
                dlAnchorElem?.setAttribute("download", "transcript.json");
                dlAnchorElem?.click();
            }, 10);
        }, 10);
    }

    useEffect(() => {
        props.updateElementGridSize("Changes", height);
    }, [height]);

    useEffect(() => {
        startTimeSinceSaveTimer();
        startAutosaveTimer();
    }, []);
    
    useEffect(() => {
        if (autosaveSaveTimer.current != null) {
            clearInterval(autosaveSaveTimer.current);
        }
        startAutosaveTimer();
    }, [transcript.autosaveInterval]);

    useEffect(() => {
        if (transcript.autosaveEnabled) {
            startAutosaveTimer();
        }
        else {
            if (autosaveSaveTimer.current != null) {
                clearInterval(autosaveSaveTimer.current);
            }
        }
    }, [transcript.autosaveEnabled]);

    const startAutosaveTimer = () => {
        autosaveSaveTimer.current = setInterval(() => {
            createActionTranscriptSaveChanges();
        }, transcript.autosaveInterval);
    };

    useEffect(() => {
        if (timeSinceSaveTimer.current != null) {
            clearInterval(timeSinceSaveTimer.current);
        }
        startTimeSinceSaveTimer();
    }, [transcript.transcriptLastSaveTime]);

    const startTimeSinceSaveTimer = () => {
        timeSinceSaveTimer.current = setInterval(() => {
            updateTimeSinceSaveString();
        }, 1000);
    };

    useEffect(() => {
        if (timeSinceSaveTimer.current != null) {
            clearInterval(timeSinceSaveTimer.current);
        }
        startTimeSinceSaveTimer();
    }, [transcript.transcriptLastSaveTime]);

    const updateTimeSinceSaveString = () => {
        if (transcript.transcriptLastSaveTime) {
            let currentTime = moment();
            let timeDifference = moment(currentTime,"DD/MM/YYYY HH:mm:ss").diff(moment(transcript.transcriptLastSaveTime,"DD/MM/YYYY HH:mm:ss"));
            let timeSince = moment.utc(timeDifference);
            updateTimeSinceSaveColor(timeDifference);
            setTimeSinceSaveString(timeSince.format("HH:mm:ss"));
        }
    }

    const updateTimeSinceSaveColor = (timeDifference: number) => {
        if (timeDifference > 60000) {
            setTimeSinceSaveColor("text-warning");
        }
        else if (timeDifference > 240000) {
            setTimeSinceSaveColor("text-danger");
        }
        else {
            setTimeSinceSaveColor("text-success");
        }
    }
    
    return (  
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                Changes
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardToggleModule("Changes", false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "mt-1 pb-2")}>
                <div className="d-flex justify-content-between">
                    <div>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === -1}
                                onMouseDown={pressStopPropagation}
                                onClick={() => createActionHistoryUndoAction()}
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title={"Undo (" + hotkey.hotkeys.find((h: { name: string; }) => h.name === "UNDO").hotkey + ")"}>
                            <i className="bi bi-arrow-counterclockwise undo-redo-button-icon"></i>
                        </button>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === history.actionHistory.length - 1}
                                onMouseDown={pressStopPropagation}
                                onClick={() => createActionHistoryRedoAction()}
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title={"Redo (" + hotkey.hotkeys.find((h: { name: string; }) => h.name === "REDO").hotkey + ")"}>
                            <i className="bi bi-arrow-clockwise undo-redo-button-icon"></i>
                        </button>
                    </div>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end"
                            onMouseDown={pressStopPropagation}
                            onClick={downloadTranscript}>
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-download me-2 export-button-icon"></i>
                            Export
                        </div>
                    </button>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end"
                            onMouseDown={pressStopPropagation}
                            onClick={createActionTranscriptSaveChanges}
                            disabled={history.currentActionIndex === transcript.saveActionIndex}>
                        <div className="d-flex align-items-center justify-content-center"
                             data-bs-toggle="tooltip" data-bs-placement="bottom" title={"Save changes (" + hotkey.hotkeys.find((h: { name: string; }) => h.name === "SAVE").hotkey + ")"}>
                            <i className="fas fa-save me-2 save-button-icon"></i>
                            Save
                        </div>
                    </button>
                </div>
                {timeSinceSaveString &&
                    <div className="time-since-save">Since last save: <span className={timeSinceSaveColor}>{timeSinceSaveString}</span></div>
                }
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(Changes)
