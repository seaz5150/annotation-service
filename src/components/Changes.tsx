import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

interface ChangesInterface {
    updateElementGridSize: any,
    size: any
}

const Changes = (props: ChangesInterface) => {
    const dispatch = useDispatch();
    const { createActionHistoryUndoAction, createActionHistoryRedoAction } = bindActionCreators(actionCreators, dispatch);
    const history = useSelector((state: any) => state.history);

    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("Changes", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header">
                Changes
            </div>
            <div className="module-content card-body mt-1 pb-2">
                <div className="d-flex justify-content-between">
                    <div>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === -1}
                                onClick={() => createActionHistoryUndoAction()}>
                            <i className="bi bi-arrow-counterclockwise undo-redo-button-icon"></i>
                        </button>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button"
                                disabled={history.currentActionIndex === history.actionHistory.length - 1}
                                onClick={() => createActionHistoryRedoAction()}>
                            <i className="bi bi-arrow-clockwise undo-redo-button-icon"></i>
                        </button>
                    </div>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end">
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-download me-2 export-button-icon"></i>
                            Export
                        </div>
                    </button>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end">
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
