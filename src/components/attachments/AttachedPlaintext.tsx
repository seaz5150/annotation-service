import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../../utils/CommonUtilities";
import { actionCreators } from "../../state/Index";

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any,
    view: any
}

const AttachedPlaintext = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule, 
            createActionDashboardToggleResizableCollapse } = bindActionCreators(actionCreators, dispatch);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        //props.updateElementGridSize(props.view.title, height);
    }, [height]);
    
    return (  
        <div className={"module module-settings " + (isCollapsed ? "module-hide-resize-handle" : "h-100")}>
            <div className="card-header d-flex justify-content-between">
                {props.view.title}
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => {setIsCollapsed(!isCollapsed); createActionDashboardToggleResizableCollapse(props.view.title)}}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardToggleModule(props.view.title, false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "text-module-margin m-0")}>
                <textarea rows={5} className="form-control form-control-sm custom-textarea textarea-disable-resize h-100" onMouseDown={pressStopPropagation} readOnly defaultValue={props.view.text} />
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(AttachedPlaintext)
