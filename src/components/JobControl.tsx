import { useEffect, useRef } from "react";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";

interface JobControlInterface {
    updateElementGridSize: any,
    size: any
}

const JobControl = (props: JobControlInterface) => {
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("JobControl", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header">
                Job control
            </div>
            <div className="module-content card-body mt-1 pb-2">
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
