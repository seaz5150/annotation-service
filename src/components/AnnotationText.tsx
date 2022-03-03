import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import AnnotationSegment from './AnnotationSegment';
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from 'react-sizeme'

const recordingJson = {
    "transcript": {
  
    "id": "da8730a-4645-hcbe35a69-a356-a7e4",
  
    "time": "2021-03-15T20:12:41Z",
  
    "source": "Human-4531",
  
    "speakerTags": [
  
        {
  
            "id": "A",
  
            "label": "ATCO radar"
  
        },
  
        {
  
            "id": "B",
  
            "label": "TIE690J"
  
        },
  
        {
  
            "id": "C",
  
            "label": "UNK"
  
        },
  
        {
  
            "id": "XT",
  
            "label": "Cross talk"
  
        }
  
    ],
  
    "segmentTags": [
  
        {
  
            "label": "Very noisy segment",
  
            "id": "noisy"
  
        },
  
        {
  
            "label": "Empty segment",
  
            "id": "empty"
  
        },
  
        {
  
            "label": "Transcript OK",
  
            "id": "checked"
  
        }
  
    ],
  
    "textTags": [
  
        {
  
            "label": "Callsign",
  
            "id": "callsign"
  
        },
  
        {
  
            "label": "Command",
  
            "id": "command"
  
        },
  
        {
  
            "label": "Argument",
  
            "id": "argument"
  
        },
  
        {
  
            "label": "Anonymize",
  
            "id": "anonym"
  
        }
  
    ],
  
    "segments": [
  
        {
  
            "start": "0.06",
  
            "end": "5.60",
  
            "speaker": "A",
  
            "language": "English",
  
            "words": [
  
                {
  
                    "label": "Timeair",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Six",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Nine",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Zero",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Juliett",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "contact",
  
                    "textTags": [
  
                        "command"
  
                    ]
  
                },
  
                {
  
                    "label": "ruzyne",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "tower",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "one",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "three",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "four",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "decimal",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "five",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "six",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "zero",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "hezký",
  
                    "language": "Czech"
  
                },
  
                {
  
                    "label": "večer",
  
                    "language": "Czech"
  
                },
  
                {
  
                    "label": "ahoj",
  
                    "language": "Czech"
  
                }
  
            ]
  
        },
  
        {
  
            "start": "5.60",
  
            "end": "10.21",
  
            "speaker": "B",
  
            "language": "English",
  
            "segmentTags": [
                "checked"
            ],
  
            "words": [
  
                {
  
                    "label": "one",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "three",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "four",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "five",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "six",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "zero",
  
                    "textTags": [
  
                        "argument"
  
                    ]
  
                },
  
                {
  
                    "label": "Timeair",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Six",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Nine",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Zero",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "Juliett",
  
                    "textTags": [
  
                        "callsign"
  
                    ]
  
                },
  
                {
  
                    "label": "bye"
  
                },
  
                {
  
                    "label": "díky",
  
                    "language": "Czech"
  
                }
  
            ]
  
        },
  
        {
  
            "start": "10.21",
  
            "end": "12.90",
  
            "speaker": "D",
  
            "words": []
  
        },
  
        {
  
            "start": "14.60",
  
            "end": "18.21",
  
            "speaker": "C",
  
            "segmentTags": [
  
                "noisy"
  
            ],
  
            "words": [
  
                {
  
                    "label": "UNK"
  
                }
  
            ]
  
        }
  
    ]
  
}};

interface AnnotationTextInterface {
    updateElementGridSize: any,
    size: any
}

function AnnotationText(props: AnnotationTextInterface) {
    const dispatch = useDispatch();
    const { createActionTranscriptInitialize,
            createActionSegmentReferencesInitialize 
          } = bindActionCreators(actionCreators, dispatch);

    const segments = useSelector((state: any) => state.recordingTranscript.segments);
    segments.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

    const segmentRefs = useRef([] as any[]); 
    segmentRefs.current = [];
    const { width, height } = props.size;

    const updateElementGridSize = props.updateElementGridSize;

    useEffect(() => {
        updateElementGridSize("AnnotationText", height);
    }, [height]);

    useEffect(() => {
        createActionTranscriptInitialize(recordingJson.transcript);
    }, []);

    const addToSegmentRefs = (segmentEl: any, segmentId: any) => {
        if (segmentEl && !segmentRefs.current.includes(segmentEl)) {
            segmentRefs.current.push({
                id: segmentId,
                ref: segmentEl
            });
            createActionSegmentReferencesInitialize(segmentRefs.current);
        }
    }

    return (
    <div className="segments">
        {segments &&
            <React.Fragment>
                {(segments.length > 0) ?
                    segments.map((segment: any) => 
                        <AnnotationSegment segmentId={segment.id} key={segment.id} segmentRef={(el: any) => addToSegmentRefs(el, segment.id)}/>
                    )
                    :
                    <div className="module module-content segment segment-placeholder">
                        <i className="bi bi-info-circle me-2 info-icon"></i>
                        Create a caption by dragging on the waveform.
                    </div>
                }
            </React.Fragment>
        }
    </div>
    );
}

export default sizeMe({ monitorHeight: true })(AnnotationText)