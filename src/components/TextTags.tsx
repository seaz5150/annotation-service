import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from "react-sizeme";
import { pressStopPropagation } from "../CommonUtilities";
import { actionCreators } from "../state";

interface AudioPlayerInterface {
    updateElementGridSize: any,
    size: any
}

const TextTags = (props: AudioPlayerInterface) => {
    const dispatch = useDispatch();
    const { createActionEditorAddSectionTag, createActionEditorAddUnpairedTag } = bindActionCreators(actionCreators, dispatch);

    const { width, height } = props.size;
    const availableTextTags = useSelector((state: any) => state.recordingTranscript.textTags);
    const availableUnpairedTags = useSelector((state: any) => state.recordingTranscript.unpairedTags);

    useEffect(() => {
        props.updateElementGridSize("TextTags", height);
    }, [height]);

    return (  
        <div className="module module-settings">
            <div className="card-header">
                Text labels
            </div>
            <div className="module-content card-body mt-1 pb-2">
                <p className="title-small">Section labels:</p>
                <div className="tag-container" onMouseDown={pressStopPropagation}>
                    {availableTextTags && 
                        availableTextTags.map((textTag: any) => 
                            <button key={textTag.id} 
                                    onMouseDown={() => createActionEditorAddSectionTag(textTag.id)}
                                    className="text-tag-button btn-secondary custom-dropdown">
                                <div className="d-flex align-items-center">
                                    <span className="tag-button-color text-tag-button-color me-1" style={{backgroundColor: textTag.color}}></span>
                                    {textTag.label}
                                </div>
                            </button>
                        )
                    }
                </div>
                <p className="title-small">Transcription tags:</p>
                <div className="tag-container" onMouseDown={pressStopPropagation}>
                    {availableUnpairedTags && 
                            availableUnpairedTags.map((unpairedTag: any) => 
                                <button key={unpairedTag.id} 
                                        onMouseDown={() => createActionEditorAddUnpairedTag(unpairedTag.id)}
                                        className="text-tag-button btn-secondary custom-dropdown">
                                    <div className="d-flex align-items-center">
                                        <span className="tag-button-color unpaired-tag-button-color me-1" style={{backgroundColor: unpairedTag.color}}></span>
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
 
export default sizeMe({ monitorHeight: true })(TextTags)
