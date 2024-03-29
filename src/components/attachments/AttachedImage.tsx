import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import sizeMe from "react-sizeme";
import { actionCreators } from "../../state/Index";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { TailSpin } from  'react-loader-spinner';

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any,
    view: any
}

const AttachedImage = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const dispatch = useDispatch();
    const { createActionDashboardToggleModuleStatic } = bindActionCreators(actionCreators, dispatch);
    const [imageDimensions, setImageDimensions] = useState({height: 0, width: 0});
    const [imageIsLoaded, setImageIsLoaded] = useState(false);

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
        <div>
            <div onMouseDownCapture={() => createActionDashboardToggleModuleStatic("AttachmentTabs", true)}
                    onMouseUp={() => createActionDashboardToggleModuleStatic("AttachmentTabs", false)}
                    className="d-flex justify-content-center">
                <TransformWrapper>
                    <TransformComponent>
                        {!imageIsLoaded &&
                            <div className="mb-2 mt-1">
                                <TailSpin height = "20"
                                        width = "20"
                                        color = "rgb(42, 171, 210)"
                                />
                            </div>
                        }
                        <img className="border-radius-025em mb-1"
                             src={props.view.url}
                             width={imageDimensions.width} 
                             height={imageDimensions.height}
                             onLoad={() => setImageIsLoaded(true)} 
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(AttachedImage)
