import { useEffect } from "react";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../../utils/CommonUtilities";

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any,
    view: any
}

const AttachedMapLeaflet = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize(props.view.label, height);
    }, [height]);
    
    return (  
        <div>
            <iframe className="border-radius-025em" src={props.view.url} width={width - 10} height="400" onMouseDown={pressStopPropagation}> </iframe>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(AttachedMapLeaflet)
