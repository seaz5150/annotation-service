import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";
import AttachedImage from "./AttachedImage";
import MapLeaflet from "./MapLeaflet";

interface JobControlInterface {
    updateElementGridSize: any,
    size: any
}

const JobControl = (props: JobControlInterface) => {
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule } = bindActionCreators(actionCreators, dispatch);

    const dashboard = useSelector((state: any) => state.dashboard);
    const jobData = useSelector((state: any) => state.job.jobData);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState(dashboard.openAttachmentTabs[0]);
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("AttachmentTabs", height);
    }, [height]);

    const attachmentRenderSwitch = (label: string) => {
        let view = jobData.user_interface.views.find((v: { label: string; }) => v.label === label);
        switch(view.type) {
            case "iframe":
                return (<div key={label}>
                           <MapLeaflet updateElementGridSize={props.updateElementGridSize} view={view} />
                       </div>);
            case "img":
                return (<div key={label}>
                           <AttachedImage updateElementGridSize={props.updateElementGridSize} view={view} />
                       </div>);
            default: 
                return null;
        }
    };
    
    return (  
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                <ul className="module-tabs">
                    <li>
                        {jobData && jobData.user_interface.views.map((v: any) =>
                            dashboard.openAttachmentTabs.some((t: string, index: number) => t === v.label) &&
                            <>
                                <button className={"tab-button " + (activeTab === v.label ? " tab-button-active" : "")}
                                        onClick={() => setActiveTab(v.label)}
                                        onMouseDown={pressStopPropagation}>
                                    {v.label}
                                </button>
                                <span className="fw-bolder">|</span>
                            </>
                        )}
                    </li>
                </ul>
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardToggleModule("AttachmentTabs", false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"" + (isCollapsed ? "module-content-collapsed" : "mt-1")}>
                {jobData && jobData.user_interface.views.map((v: any) =>
                    (dashboard.openAttachmentTabs.some((t: string) => t === v.label) && activeTab === v.label) && attachmentRenderSwitch(v.label)      
                )}
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(JobControl)
