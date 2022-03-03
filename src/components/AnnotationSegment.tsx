import { getFormattedTime, rgbaToHexAlpha } from "../CommonUtilities";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { UnassignedColor } from "../enums/SegmentColors";

interface AnnotationSegmentInterface {
    segmentId: string,
    segmentRef: any
}

const AnnotationSegment = (props: AnnotationSegmentInterface) => {
    const dispatch = useDispatch();
    const { createActionAudioPlaySegment,
            createActionAudioPlayFromTime,
            createActionTranscriptSegmentDelete,
            createActionTranscriptSegmentUpdate
          } = bindActionCreators(actionCreators, dispatch);

    const segment = useSelector((state: any) => state.recordingTranscript.segments.find((segment: { id: string; }) => segment.id === props.segmentId));
    const availableSpeakerTags = useSelector((state: any) => state.recordingTranscript.speakerTags);
    const availableSegmentTags = useSelector((state: any) => state.recordingTranscript.segmentTags);

    const segmentColorAlpha = 0.75; // Alpha values 0-1
    const segmentColorAlphaHex = rgbaToHexAlpha(segmentColorAlpha);

    const segmentSpeaker = availableSpeakerTags.find((tag: { id: any; }) => tag.id === segment.speaker);
    const segmentColor = (segmentSpeaker ? segmentSpeaker.color : UnassignedColor + segmentColorAlphaHex);

    const [speakerId, setSpeakerId] = useState((segment.speaker));
    const [segmentTags, setSegmentTags] = useState((segment.segmentTags));

    useEffect(() => {
        if (speakerId !== segment.speaker) {
            createActionTranscriptSegmentUpdate(segment.id, undefined, undefined, speakerId);
        }
    }, [speakerId]);

    useEffect(() => {
        if (segmentTags !== segment.segmentTags) {
            createActionTranscriptSegmentUpdate(segment.id, undefined, undefined, undefined, segmentTags);
        }
    }, [segmentTags]);

    const handlePress = (e: any) => {
        e.stopPropagation();
    }

    const setSegmentTag = (e: React.ChangeEvent<HTMLInputElement>, segmentTagId: string) => {
        let newSegmentTags = Array();
        if (segmentTags !== undefined) {
            newSegmentTags = segmentTags.map((tag: string) => tag);
        }

        if (e.target.checked) {
            if (!newSegmentTags.some((tag: string) => tag === segmentTagId)){
                newSegmentTags.push(segmentTagId);
            }
        }
        else {
            const index = newSegmentTags.indexOf(segmentTagId);
            if (index > -1) {
                newSegmentTags.splice(index, 1);
            }
        }

        setSegmentTags(newSegmentTags);
    }

    return (
        <React.Fragment>
                 {segment &&
                     <div className="module module-content p-0 segment" 
                     style={{backgroundColor : segmentColor}}
                     ref={props.segmentRef}
                            >
                        <div className="p-0 segment-play-panel">
                            <div className="segment-play-panel-content">
                                <button className="strip-button-style segment-play-button"
                                        onMouseDown={e => handlePress(e)}
                                        onClick={() => createActionAudioPlaySegment(segment.id)}
                                >
                                    <i className="bi bi-play-fill"></i>
                                </button>
                                <div className="segment-times ps-1"
                                        onMouseDown={e => handlePress(e)}
                                >
                                    <button className="strip-button-style segment-time-start"
                                        onMouseDown={e => handlePress(e)}
                                        onClick={() => createActionAudioPlayFromTime(Number(segment.start))}
                                    >{getFormattedTime(Number(segment.start))}</button>
                                
                                    <button className="strip-button-style segment-time-end"
                                        onMouseDown={e => handlePress(e)}
                                        onClick={() => createActionAudioPlayFromTime(Number(segment.end))}
                                    >{getFormattedTime(Number(segment.end))}</button>
                                </div>
                            </div>
                        </div>
                        <div className="segment-text-panel">
                            <p className="segment-text"
                                //contentEditable="true"
                                onMouseDown={e => handlePress(e)}
                            >
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus et lorem id felis nonummy placerat. Integer lacinia. Praesent in mauris eu tortor porttitor accumsan.
                            </p>
                            <div className="segment-tag-bar">
                                <select className="form-select form-select-sm custom-dropdown speaker-select"
                                        onMouseDown={e => handlePress(e)}
                                        value={speakerId}
                                        onChange={e => setSpeakerId(e.target.value)}
                                >
                                    <option value=""></option>
                                    {availableSpeakerTags &&
                                        availableSpeakerTags.map((speakerTag: any) =>
                                            <option value={speakerTag.id} key={speakerTag.id}>{speakerTag.label ? speakerTag.label : speakerTag.id}</option>                                                   
                                        )
                                    }
                                </select>
                                <div className="dropdown">
                                    <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown"
                                            onMouseDown={e => handlePress(e)}
                                            type="button" id="dropdownMenuButton1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                    >
                                        Segment labels
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end segment-label-dropdown-menu"
                                        aria-labelledby="dropdownMenuButton1" 
                                        onMouseDown={e => handlePress(e)}
                                    >
                                        <li>
                                            {availableSegmentTags &&
                                                availableSegmentTags.map((availableSegmentTag: any) =>
                                                    <a className="dropdown-item segment-label-dropdown-item me-3" href="#" key={availableSegmentTag.id}>
                                                        {availableSegmentTag.label}
                                                        <input className="form-check-input custom-checkbox col-2 ms-auto me-3" 
                                                               type="checkbox"
                                                               checked={segmentTags ? Array.from(segmentTags).some((tag: any) => tag === availableSegmentTag.id) : false}
                                                               onMouseDown={e => handlePress(e)}
                                                               onChange={e => setSegmentTag(e, availableSegmentTag.id)}
                                                               key={Math.random()}
                                                        />
                                                    </a>                                              
                                                )
                                            }
                                        </li>
                                    </ul>
                                </div>
                
                                <button className="strip-button-style segment-delete-button"
                                        onMouseDown={e => handlePress(e)}
                                        onClick={() => createActionTranscriptSegmentDelete(segment.id)}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                 }   
        </React.Fragment>
    );
}

export default AnnotationSegment;