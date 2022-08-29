import { getFormattedTime, pressStopPropagation, rgbaToHexAlpha } from "../../utils/CommonUtilities";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/Index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { UnassignedColor } from "../../enums/SegmentColors";
import AnnotationTextEditor from "./AnnotationTextEditor";

interface AnnotationTextSegmentInterface {
    segmentId: string,
    segmentRef: any,
    parentWidth: number
}

const AnnotationTextSegment = (props: AnnotationTextSegmentInterface) => {
    const dispatch = useDispatch();
    const { createActionAudioPlaySegment,
            createActionAudioPlayFromTime,
            createActionTranscriptSegmentDelete,
            createActionTranscriptSegmentUpdate,
            createActionTranscriptPlayerAddAction,
            createActionHistoryAddAction,
            createActionEditorRequestDataSave,
            createActionTranscriptUpdateWords,
            createActionEditorReinitializeWords,
            createActionTranscriptResetAmountUpdated,
            createActionAudioPauseSegment
          } = bindActionCreators(actionCreators, dispatch);

    
    const segments = useSelector((state: any) => state.recordingTranscript.segments);
    segments.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

    const segment = useSelector((state: any) => state.recordingTranscript.segments.find((segment: { id: string; }) => segment.id === props.segmentId));
    const availableSpeakerTags = useSelector((state: any) => state.recordingTranscript.speakerTags);
    const availableSegmentTags = useSelector((state: any) => state.recordingTranscript.segmentTags);
    const availableTextTags = useSelector((state: any) => state.job.textTags);
    const availableUnpairedTags = useSelector((state: any) => state.job.unpairedTags);

    const audioPlay = useSelector((state: any) => state.audioPlay);

    const segmentColorAlpha = 0.75; // Alpha values 0-1
    const segmentColorAlphaHex = rgbaToHexAlpha(segmentColorAlpha);

    const segmentSpeaker = availableSpeakerTags.find((tag: { id: any; }) => tag.id === segment.speaker);
    const segmentColor = (segmentSpeaker ? segmentSpeaker.color : UnassignedColor + segmentColorAlphaHex);

    const [speakerId, setSpeakerId] = useState((segment.speaker));
    const [segmentTags, setSegmentTags] = useState((segment.segment_tags));
    const [segmentWords, setSegmentWords] = useState((segment.words));

    const amountUpdated = useSelector((state: any) => state.recordingTranscript.amountUpdated);
    const [mergeInProgress, setMergeInProgress] = useState(false);

    useEffect(() => {
        if (speakerId !== segment.speaker) {
            createActionHistoryAddAction("AnnotationTextSegment", segment.id);
            createActionTranscriptPlayerAddAction("UPDATE", undefined, {id: segment.id, speaker: speakerId});
            createActionTranscriptSegmentUpdate(segment.id, undefined, undefined, speakerId);
        }
    }, [speakerId]);

    useEffect(() => {
        if (segmentTags !== segment.segment_tags) {
            createActionHistoryAddAction("AnnotationTextSegment", segment.id);
            createActionTranscriptPlayerAddAction("UPDATE", undefined, {id: segment.id, segment_tags: segmentTags});
            createActionTranscriptSegmentUpdate(segment.id, undefined, undefined, undefined, segmentTags);
        }
    }, [segmentTags]);

    const deleteSegment = () => {
        createActionHistoryAddAction("AnnotationTextSegment", segment.id, "REMOVE");
        createActionTranscriptPlayerAddAction("REMOVE", undefined, {id: segment.id});
        createActionEditorRequestDataSave(segment.id);
        setTimeout(() => {createActionTranscriptSegmentDelete(segment.id)}, 10);
    }

    const toggleSegmentTag = (segmentTagId: string) => {
        let newSegmentTags = Array();
        if (segmentTags !== undefined) {
            newSegmentTags = segmentTags.map((tag: string) => tag);
        }

        if (!newSegmentTags.some((tag: string) => tag === segmentTagId)) {
            newSegmentTags.push(segmentTagId);
        }
        else {
            const index = newSegmentTags.indexOf(segmentTagId);
            if (index > -1) {
                newSegmentTags.splice(index, 1);
            }
        }

        setSegmentTags(newSegmentTags);
    }

    // Preparation for segment merge.
    const mergeNextSegmentStepOne = () => {
        createActionTranscriptResetAmountUpdated();
        createActionTranscriptUpdateWords();
        setMergeInProgress(true);
    }

    const mergeNextSegmentStepTwo = () => {
        let segmentIndex = segments.findIndex((s: { id: string; }) => s.id == segment.id);
        let nextSegment = segments[segmentIndex + 1];
        let resultSegment = JSON.parse(JSON.stringify(segment));

        resultSegment.end = nextSegment.end;
        resultSegment.words = resultSegment.words.concat(nextSegment.words);

        createActionHistoryAddAction("AnnotationTextSegment", resultSegment.id, "MERGE", nextSegment.id);
        createActionTranscriptPlayerAddAction("MERGE", undefined, JSON.parse(JSON.stringify(resultSegment)), JSON.parse(JSON.stringify(nextSegment)));

        createActionEditorRequestDataSave(resultSegment.id);
        setTimeout(() => {
            createActionTranscriptSegmentUpdate(resultSegment.id, undefined, segment.end, undefined, undefined, resultSegment.words);
            createActionEditorRequestDataSave(nextSegment.id);
            setTimeout(() => {createActionTranscriptSegmentDelete(nextSegment.id); createActionEditorReinitializeWords([resultSegment.id]);}, 10);
        }, 10);
    }

    useEffect(() => {
        // Continue with merge once words are parsed from all editors.
        if (mergeInProgress && amountUpdated === segments.length) {
            setMergeInProgress(false);
            createActionTranscriptResetAmountUpdated();
            mergeNextSegmentStepTwo();
        }
    }, [amountUpdated]);

    return (
        <React.Fragment>
                 {segment &&
                     <div className="module module-content p-0 segment" 
                          style={{backgroundColor : segmentColor}}
                          ref={props.segmentRef}>
                        {(segments.indexOf(segment) !== segments.length - 1) &&
                            <button className="merge-segments-button text-tag-button btn-secondary custom-dropdown"
                                    onMouseDown={pressStopPropagation}
                                    onClick={mergeNextSegmentStepOne}
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Merge segments">
                            <i className="fas fa-arrows-alt-v"></i>
                            </button>
                        }
                        <div className="p-0 segment-play-panel">
                            <div className="segment-play-panel-content">
                                {audioPlay.currentlyPlayingSegmentId == segment.id ?
                                    <button className="strip-button-style segment-play-button"
                                            onMouseDown={e => pressStopPropagation(e)}
                                            onClick={() => createActionAudioPauseSegment(segment.id)}
                                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pause segment">
                                        <i className="bi bi-pause-fill"></i>
                                    </button>
                                    :
                                    <button className="strip-button-style segment-play-button"
                                            onMouseDown={e => pressStopPropagation(e)}
                                            onClick={() => createActionAudioPlaySegment(segment.id)}
                                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Play segment">
                                        <i className="bi bi-play-fill"></i>
                                    </button>
                                }
                                <div className="segment-times ps-1"
                                        onMouseDown={e => pressStopPropagation(e)}
                                >
                                    <button className="strip-button-style segment-time-start"
                                        onMouseDown={e => pressStopPropagation(e)}
                                        onClick={() => createActionAudioPlayFromTime(Number(segment.start))}
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Play segment from the start"
                                    >{getFormattedTime(Number(segment.start))}</button>
                                
                                    <button className="strip-button-style segment-time-end"
                                        onMouseDown={e => pressStopPropagation(e)}
                                        onClick={() => createActionAudioPlayFromTime(Number(segment.end))}
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Play segment from the end"
                                    >{getFormattedTime(Number(segment.end))}</button>
                                </div>
                            </div>
                        </div>
                        <div className="segment-text-panel ms-2">
                            <AnnotationTextEditor segmentId={segment.id}
                                              words={segmentWords}
                                              textTags={availableTextTags}
                                              unpairedTags={availableUnpairedTags} 
                            />
                            <div className="segment-tag-bar">
                                <select className="form-select form-select-sm custom-dropdown speaker-select"
                                        onMouseDown={e => pressStopPropagation(e)}
                                        value={segment.speaker}
                                        onChange={e => setSpeakerId(e.target.value)}
                                >
                                    <option value=""></option>
                                    {availableSpeakerTags &&
                                        availableSpeakerTags.map((speakerTag: any) =>
                                            <option value={speakerTag.id} key={speakerTag.id}>{speakerTag.label ? speakerTag.label : speakerTag.id}</option>                                                   
                                        )
                                    }
                                </select>
                                {availableSegmentTags.length > 3 || props.parentWidth < 593 ?
                                    <div className="dropstart d-flex align-items-center" data-bs-boundary="body">
                                        <span className="segment-label-counter pe-2"></span>
                                        <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown segment-label-dropdown-button"
                                                onMouseDown={e => pressStopPropagation(e)}
                                                type="button" id="dropdownMenuButton1"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                        >
                                            {availableSegmentTags && "Segment labels " + (segment.segment_tags ? segment.segment_tags.length : "0") + "/" + availableSegmentTags.length}
                                        </button>
                                        <ul className="dropdown-menu position-fixed segment-label-dropdown-menu"
                                            aria-labelledby="dropdownMenuButton1"
                                            onMouseDown={e => pressStopPropagation(e)}
                                        >
                                            <li>
                                                {availableSegmentTags &&
                                                    availableSegmentTags.map((availableSegmentTag: any) =>
                                                        <a className="dropdown-item segment-label-dropdown-item me-3" 
                                                        href="#" 
                                                        key={availableSegmentTag.id} 
                                                        onClick={(e) => {pressStopPropagation(e); toggleSegmentTag(availableSegmentTag.id);}}>
                                                            {availableSegmentTag.label}
                                                            <input className="form-check-input custom-checkbox col-2 ms-auto me-3" 
                                                                type="checkbox"
                                                                checked={segment.segment_tags ? Array.from(segment.segment_tags).some((tag: any) => tag === availableSegmentTag.id) : false}
                                                                readOnly
                                                            />
                                                        </a>                                              
                                                    )
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    :
                                    <div>
                                        {availableSegmentTags &&
                                            availableSegmentTags.map((availableSegmentTag: any) =>
                                                <button className="btn btn-sm segment-label-button me-1 justify-content-center align-items-center"  
                                                        key={availableSegmentTag.id} 
                                                        onMouseDown={e => pressStopPropagation(e)}
                                                        onClick={(e) => {pressStopPropagation(e); toggleSegmentTag(availableSegmentTag.id);}}>
                                                    {availableSegmentTag.label}
                                                    <input className="form-check-input col-2 ms-2 segment-label-button-checkbox" 
                                                        type="checkbox"
                                                        checked={segment.segment_tags ? Array.from(segment.segment_tags).some((tag: any) => tag === availableSegmentTag.id) : false}
                                                        readOnly
                                                    />
                                                </button>                                              
                                            )
                                        }
                                    </div>
                                }
                                <button className="strip-button-style segment-delete-button"
                                        onMouseDown={e => pressStopPropagation(e)}
                                        onClick={() => deleteSegment()}
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

export default AnnotationTextSegment;