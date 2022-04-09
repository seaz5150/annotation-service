import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../../CommonUtilities";
import { actionCreators } from "../../state";
import AttachedImage from "./AttachedImage";
import MapLeaflet from "./AttachedMapLeaflet";

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
    const [activeTab, setActiveTab] = useState(jobData.user_interface.views.find((v: { type: string; }) => (v.type === "img" || v.type === "iframe")).title);
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("AttachmentTabs", height);
    }, [height]);

    const attachmentRenderSwitch = (title: string) => {
        let view = jobData.user_interface.views.find((v: { title: string; }) => v.title === title);
        switch(view.type) {
            case "iframe":
                return (<div key={title}>
                           <MapLeaflet updateElementGridSize={props.updateElementGridSize} view={view} />
                       </div>);
            case "img":
                return (<div key={title}>
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
                        {jobData && jobData.user_interface.views.map((v: any) => (v.type === "img" || v.type === "iframe") &&
                            <>
                                <button className={"tab-button " + (activeTab === v.title ? " tab-button-active" : "")}
                                        onClick={() => setActiveTab(v.title)}
                                        onMouseDown={pressStopPropagation}>
                                    {v.title}
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
                    activeTab === v.title && attachmentRenderSwitch(v.title)      
                )}
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(JobControl)
