import { bindActionCreators } from "@reduxjs/toolkit";
import { ReactChild, ReactFragment, ReactPortal, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface SpeakerLabelsInterface {
    updateElementGridSize: any,
    size: any
}

const SpeakerLabels = (props: SpeakerLabelsInterface) => {
    const { width, height } = props.size;
    const availableSpeakerTags = useSelector((state: any) => state.recordingTranscript.speakerTags);
    const dispatch = useDispatch();
    const { createActionTranscriptSpeakerCreate, createActionTranscriptSpeakerUpdate } = bindActionCreators(actionCreators, dispatch);

    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        props.updateElementGridSize("SpeakerLabels", height);
    }, [height]);

    const setLabel = (e: { target: { value: string; }; }, labelId: string, currentLabel: string) => {
        if (e.target.value !== currentLabel) {
            console.log(e.target.value)
            createActionTranscriptSpeakerUpdate(labelId, e.target.value);
        }
    };
    
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
                            <input className="speaker-label-input" type="text" defaultValue={tag.label} onBlur={(e) => setLabel(e, tag.id, tag.label)}></input>
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-end pt-2">
                    <button className="text-tag-button btn-secondary custom-dropdown save-button py-1 m-0" 
                            onMouseDown={pressStopPropagation}
                            onClick={() => createActionTranscriptSpeakerCreate(alphabet[availableSpeakerTags.length], "")}>
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
