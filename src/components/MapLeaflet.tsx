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

const MapLeaflet = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const dispatch = useDispatch();
    const { createActionDashboardToggleModule } = bindActionCreators(actionCreators, dispatch);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        props.updateElementGridSize(props.view.label, height);
    }, [height]);
    
    return (  
        <div>
                <iframe className="border-radius-025em" src={props.view.url} width={width - 10} height="400" onMouseDown={pressStopPropagation}> </iframe>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(MapLeaflet)
