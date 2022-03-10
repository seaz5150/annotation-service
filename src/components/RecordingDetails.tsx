import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface RecordingDetailsInterface {
    updateElementGridSize: any,
    size: any
}

const RecordingDetails = (props: RecordingDetailsInterface) => {
    const dispatch = useDispatch();
    const { createActionDashboardCloseModule } = bindActionCreators(actionCreators, dispatch);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { width, height } = props.size;

    const handlePress = (e: any) => {
        e.stopPropagation();
    }

    useEffect(() => {
        props.updateElementGridSize("RecordingDetails", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                Recording details
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardCloseModule("TextTags")}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "mt-1 pb-2")}>
                <div className="row">
                    <p className="title-small col-3">Name:</p>
                    <p className="text-small col-9 d-flex justify-content-end">YSSY Tower 2021-06-02 22:13:43</p>
                </div>
                <p className="title-small col-12 mb-1">Description:</p>
                <textarea className="form-control form-control-sm custom-textarea" onMouseDown={e => handlePress(e)} readOnly defaultValue="Integer lacinia. Maecenas aliquet accumsan leo. Aliquam ante. Aenean fermentum risus id tortor. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Nunc tincidunt ante vitae massa. Vivamus ac leo pretium faucibus."/>
                <p className="title-small col-12 mb-1 mt-2">Display attached resources:</p>
                <div className="row">
                    <p className="title-small col-10 ms-2 fw-normal">Traffic map</p>
                    <input className="form-check-input custom-checkbox col-2 ms-3" type="checkbox" value="" onMouseDown={e => handlePress(e)} />
                </div>
                <div className="row mt-3 align-items-center">
                    <p className="title-small col-7">Manuals and others:</p>
                    <div className="dropdown col-5 d-flex justify-content-end">
                        <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown"
                                onMouseDown={e => handlePress(e)}
                                type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                        >
                            Attached links
                        </button>
                        <ul className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton1" 
                            onMouseDown={e => handlePress(e)}
                        >
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(RecordingDetails)
