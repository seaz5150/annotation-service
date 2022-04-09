import { bindActionCreators } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../utils/CommonUtilities";
import { actionCreators } from "../state/Index";

interface RecordingDetailsInterface {
    updateElementGridSize: any,
    size: any
}

const RecordingDetails = (props: RecordingDetailsInterface) => {
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule } = bindActionCreators(actionCreators, dispatch);

    const jobData = useSelector((state: any) => state.job.jobData);
    const dashboard = useSelector((state: any) => state.dashboard);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { width, height } = props.size;

    const handlePress = (e: any) => {
        e.stopPropagation();
    }

    useEffect(() => {
        props.updateElementGridSize("RecordingDetails", height);
    }, [height]);

    const toggleModule = (e: React.ChangeEvent<HTMLInputElement>, moduleName: string) => {
        createActionDashboardToggleModule(moduleName, e.target.checked);
    }
    
    return jobData && (
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                Job details
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardToggleModule("RecordingDetails", false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "mt-1 pb-2")}>
                <div className="row">
                    <p className="title-small col-3">Name:</p>
                    <p className="text-small col-9 d-flex justify-content-end">{jobData.title}</p>
                </div>
                <p className="title-small col-12 mb-1">Description:</p>
                <textarea className="form-control form-control-sm custom-textarea" onMouseDown={e => handlePress(e)} readOnly defaultValue={jobData.description}/>
                <p className="title-small col-12 mb-1 mt-2">Display attached resources:</p>
                <div className="row">
                    {jobData.user_interface.views.map((v: any) => v.type === "text" &&
                        <React.Fragment key={v.title}>
                            <p className="title-small col-10 ms-2 fw-normal">{v.title}</p>
                            <input className="form-check-input custom-checkbox col-2 ms-3" 
                                    type="checkbox"
                                    onMouseDown={e => pressStopPropagation(e)} 
                                    onChange={(e) => toggleModule(e, v.title)}
                                    checked={(dashboard.openModules.some((om: string) => om === v.title) || dashboard.openAttachmentTabs.some((om: string) => om === v.title))}/>
                        </React.Fragment>
                    )}
                    {jobData.user_interface.views.some((v: any) => v.type === "img" || v.type === "iframe") &&
                        <React.Fragment>
                            <p className="title-small col-10 ms-2 fw-normal">Visual resources (images, maps...)</p>
                            <input className="form-check-input custom-checkbox col-2 ms-3" 
                                    type="checkbox"
                                    onMouseDown={e => pressStopPropagation(e)} 
                                    onChange={(e) => toggleModule(e, "AttachmentTabs")}
                                    checked={(dashboard.openModules.some((om: string) => om === "AttachmentTabs"))}/>
                        </React.Fragment>
                    }
                </div>
                <div className="row mt-3 align-items-center">
                    <p className="title-small col-7">Manuals and others:</p>
                    <div className="dropup col-5 d-flex justify-content-end">
                        <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown"
                                onMouseDown={e => handlePress(e)}
                                type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                        >
                            <span className="me-1">Attached links</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end segment-label-dropdown-menu"
                            aria-labelledby="dropdownMenuButton1"
                            onMouseDown={e => pressStopPropagation(e)}
                        >
                            <li>
                                {jobData.user_interface.links.map((link: any) =>
                                        <a className="dropdown-item segment-label-dropdown-item me-3" href={link.url} target="_blank" key={link.title}>
                                            {link.title}
                                        </a>                                              
                                    )
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(RecordingDetails)
