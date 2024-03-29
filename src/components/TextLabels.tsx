import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../utils/CommonUtilities";
import { actionCreators } from "../state/Index";

interface AudioPlayerInterface {
    updateElementGridSize: any,
    size: any
}

const TextLabels = (props: AudioPlayerInterface) => {
    const dispatch = useDispatch();
    const { createActionEditorAddSectionTag, 
            createActionEditorAddUnpairedTag, 
            createActionDashboardToggleModule,
            createActionDashboardToggleCollapsedModule } = bindActionCreators(actionCreators, dispatch);

    const availableTextTags = useSelector((state: any) => state.job.textTags);
    const availableUnpairedTags = useSelector((state: any) => state.job.unpairedTags);
    const dashboard = useSelector((state: any) => state.dashboard);

    const { width, height } = props.size;
    const moduleName = "TextLabels";

    useEffect(() => {
        props.updateElementGridSize(moduleName, height);
    }, [height]);

    return (  
    <div className="module module-settings">
        <div className="card-header d-flex justify-content-between">
            Text labels
            <span className="d-flex align-content-center">
                <button className="strip-button-style module-header-button pe-2"
                        onMouseDown={pressStopPropagation}
                        onClick={() => createActionDashboardToggleCollapsedModule(moduleName)}>
                    <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                </button>
                <button className="strip-button-style module-header-button"
                        onMouseDown={pressStopPropagation}
                        onClick={() => createActionDashboardToggleModule(moduleName, false)}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </span>
        </div>
        <div className={"module-content card-body " + (dashboard.collapsedModules.find((m: string) => m == moduleName) ? "module-content-collapsed" : "mt-1 pb-2")}>
            <p className="title-small">Section labels:</p>
            <div className="tag-container" onMouseDown={pressStopPropagation}>
                {availableTextTags && 
                    availableTextTags.map((textTag: any, index: number) => 
                        <button key={textTag.label} 
                                onMouseDown={() => createActionEditorAddSectionTag(textTag.label)}
                                className="text-tag-button btn-secondary custom-dropdown">
                            <div className="d-flex align-items-center">
                                <span className="tag-button-color text-tag-button-color me-1" style={{backgroundColor: textTag.color}}>{index + 1}</span>
                                {textTag.label}
                            </div>
                        </button>
                    )
                }
            </div>
            <p className="title-small">Transcription tags:</p>
            <div className="tag-container" onMouseDown={pressStopPropagation}>
                {availableUnpairedTags && 
                        availableUnpairedTags.map((unpairedTag: any, index: number) => 
                            <button key={unpairedTag.id} 
                                    onMouseDown={() => createActionEditorAddUnpairedTag(unpairedTag.id)}
                                    className="text-tag-button btn-secondary custom-dropdown">
                                <div className="d-flex align-items-center">
                                    <span className="tag-button-color unpaired-tag-button-color me-1" style={{backgroundColor: unpairedTag.color}}>{availableTextTags?.length + index + 1}</span>
                                    {unpairedTag.label}
                                </div>
                            </button>
                        )
                }
            </div>
        </div>
    </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(TextLabels)
