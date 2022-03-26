import { bindActionCreators } from "@reduxjs/toolkit";
import { ReactChild, ReactFragment, ReactPortal, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any,
    view: any
}

const AttachedImage = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule } = bindActionCreators(actionCreators, dispatch);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({height: 0, width: 0});

    useEffect(() => {
        props.updateElementGridSize(props.view.label, height);
    }, [height]);

    useEffect(() => {
        setImageSize();
    }, []);

    const setImageSize = () => {
        const image = new Image();
        image.src = props.view.url;
        let resizeRatio = image.width / width;
        image.onload = () => {
          setImageDimensions({
            height: image.height / resizeRatio,
            width: width - 10
          });
        };
    };

    useEffect(() => {
        setImageSize();
    }, [width]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header d-flex justify-content-between">
                {props.view.label}
                <span className="d-flex align-content-center">
                    <button className="strip-button-style module-header-button pe-2"
                            onMouseDown={pressStopPropagation}
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i style={{fontSize: "1.2em"}} className="bi bi-dash-lg"></i>
                    </button>
                    <button className="strip-button-style module-header-button"
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionDashboardToggleModule(props.view.label, false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </span>
            </div>
            <div className={"module-content card-body " + (isCollapsed ? "module-content-collapsed" : "p-0 pt-1 m-0")}>
                <img className="border-radius-025em mb-1" src={props.view.url} width={imageDimensions.width} height={imageDimensions.height}></img>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(AttachedImage)
