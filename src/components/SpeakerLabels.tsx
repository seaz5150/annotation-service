import { ReactChild, ReactFragment, ReactPortal, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any
}

const SpeakerLabels = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const availableSpeakerTags = useSelector((state: any) => state.recordingTranscript.speakerTags);
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        props.updateElementGridSize("SpeakerLabels", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header">
                Speaker labels
            </div>
            <div className="module-content card-body mt-2 pb-2">
                <div className="speaker-label-container">
                    {availableSpeakerTags && availableSpeakerTags.map((tag: any, index: number) => 
                        <div key={tag.id} className="d-flex" onMouseDown={pressStopPropagation}>
                            <div className="d-flex align-items-center">
                            <span className="tag-button-color speaker-label-color me-2" style={{backgroundColor: tag.color}}></span>
                                <span className="speaker-label-letter me-3">{alphabet[index]}</span>
                            </div>
                            <input className="speaker-label-input" type="text" value={tag.label}></input>
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-end pt-2">
                    <button className="text-tag-button btn-secondary custom-dropdown save-button m-0">
                            <div className="d-flex align-items-center justify-content-center">
                                <i className="bi bi-plus-lg me-2 export-button-icon"></i>
                                Add label
                            </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(SpeakerLabels)
