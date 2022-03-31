import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { bindActionCreators } from "redux";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface ChangesInterface {
    updateElementGridSize: any,
    size: any
}

const Changes = (props: ChangesInterface) => {
    const dispatch = useDispatch();
    const { createActionHistoryUndoAction, 
            createActionHistoryRedoAction, 
            createActionDashboardToggleModule,
            createActionJobSaveChanges } = bindActionCreators(actionCreators, dispatch);
    const history = useSelector((state: any) => state.history);
    const job = useSelector((state: any) => state.job);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [timeSinceSaveString, setTimeSinceSaveString] = useState("");
    const [timeSinceSaveColor, setTimeSinceSaveColor] = useState("text-success");
    const timeSinceSaveTimer = useRef<any>();
    const autosaveSaveTimer = useRef<any>();

    const { width, height } = props.size;

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
    }, [job.autosaveInterval]);

    useEffect(() => {
        if (job.autosaveEnabled) {
            startAutosaveTimer();
        }
        else {
            if (autosaveSaveTimer.current != null) {
                clearInterval(autosaveSaveTimer.current);
            }
        }
    }, [job.autosaveEnabled]);

    const startAutosaveTimer = () => {
        autosaveSaveTimer.current = setInterval(() => {
            createActionJobSaveChanges();
        }, job.autosaveInterval);
    };

    useEffect(() => {
        if (timeSinceSaveTimer.current != null) {
            clearInterval(timeSinceSaveTimer.current);
        }
        startTimeSinceSaveTimer();
    }, [job.jobLastSaveTime]);

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
    }, [job.jobLastSaveTime]);

    const updateTimeSinceSaveString = () => {
        if (job.jobLastSaveTime) {
            let currentTime = moment();
            let timeDifference = moment(currentTime,"DD/MM/YYYY HH:mm:ss").diff(moment(job.jobLastSaveTime,"DD/MM/YYYY HH:mm:ss"));
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
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title="Undo">
                            <i className="bi bi-arrow-counterclockwise undo-redo-button-icon"></i>
                        </button>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === history.actionHistory.length - 1}
                                onMouseDown={pressStopPropagation}
                                onClick={() => createActionHistoryRedoAction()}
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title="Redo">
                            <i className="bi bi-arrow-clockwise undo-redo-button-icon"></i>
                        </button>
                    </div>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end"
                            onMouseDown={pressStopPropagation}>
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-download me-2 export-button-icon"></i>
                            Export
                        </div>
                    </button>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end"
                            onMouseDown={pressStopPropagation}
                            onClick={createActionJobSaveChanges}
                            disabled={history.currentActionIndex === job.saveActionIndex}>
                        <div className="d-flex align-items-center justify-content-center">
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
