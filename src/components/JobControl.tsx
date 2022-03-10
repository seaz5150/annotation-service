import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface JobControlInterface {
    updateElementGridSize: any,
    size: any
}

const JobControl = (props: JobControlInterface) => {
    const dispatch = useDispatch();
    const { createActionDashboardCloseModule } = bindActionCreators(actionCreators, dispatch);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("JobControl", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                Job control
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardCloseModule("JobControl")}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "mt-1 pb-2")}>
                <div className="row">
                    <div className="col" style={{maxWidth: "200px"}}>
                        <button className="text-tag-button custom-dropdown job-control-button job-control-refuse-button float-end"
                                onMouseDown={pressStopPropagation}>
                            <i className="bi bi-x-lg me-1"></i>
                            Close as REFUSED
                        </button>
                        <button className="text-tag-button custom-dropdown job-control-button job-control-skip-button float-end"
                                onMouseDown={pressStopPropagation}>
                            <i className="bi bi-arrow-left me-1"></i>
                            Previous job
                        </button>
                    </div>
                    <div className="col" style={{maxWidth: "200px"}}>
                        <button className="text-tag-button custom-dropdown job-control-button job-control-done-button float-start"
                                onMouseDown={pressStopPropagation}>
                            <i className="bi bi-check-lg me-1"></i>
                            Close as DONE
                        </button>
                        <button className="text-tag-button custom-dropdown job-control-button job-control-skip-button float-start"
                                onMouseDown={pressStopPropagation}>
                            Next job
                            <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(JobControl)
