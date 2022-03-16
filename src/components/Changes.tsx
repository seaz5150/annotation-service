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
    const { createActionHistoryUndoAction, createActionHistoryRedoAction, createActionDashboardToggleModule } = bindActionCreators(actionCreators, dispatch);
    const history = useSelector((state: any) => state.history);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("Changes", height);
    }, [height]);
    
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
                                onClick={() => createActionHistoryUndoAction()}>
                            <i className="bi bi-arrow-counterclockwise undo-redo-button-icon"></i>
                        </button>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === history.actionHistory.length - 1}
                                onMouseDown={pressStopPropagation}
                                onClick={() => createActionHistoryRedoAction()}>
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
                            onMouseDown={pressStopPropagation}>
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-save me-2 save-button-icon"></i>
                            Save
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(Changes)
