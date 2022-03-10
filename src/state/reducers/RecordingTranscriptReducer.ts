import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SegmentColors } from "../../enums/SegmentColors"
import { TagColors } from "../../enums/TagColors";

const initialState = {
    speakerTags: [] as any[],
    segmentTags: null,
    textTags: null,
    unpairedTags: null,
    segments: [] as any[]
};

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "TRANSCRIPT_INITIALIZE":
            var segments = action.payload.segments;
            var speakerTags = action.payload.speakerTags;
            var textTags = action.payload.textTags;

            action.payload.unpairedTags = [
                {"label": "Unknown", "id": "unknown"},
                {"label": "Hesitation", "id": "hesitation"},
                {"label": "Noise", "id": "noise"},
                {"label": "Speaker noise", "id": "speakernoise"},
                {"label": "Double-press PTT", "id": "doublepress"},
                {"label": "Crosstalk", "id": "crosstalk"}
            ];

            var unpairedTags = action.payload.unpairedTags;

            for (let segment in segments) {
                let segmentObj = segments[segment];
                // Add unique IDs to the segments before saving them to the store.
                segmentObj.id = uuidv4();

                // Some speaker labels may not be specified and used in the segments anyway, so add those.
                if (!speakerTags.find((tag: { id: any; }) => tag.id === segmentObj.speaker)) {
                    speakerTags.push({
                        id: segmentObj.speaker,
                        label: ""
                    })
                }
            }
            
            let colorCounter = 0;
            for (let i in speakerTags) {
                let speakerTag = speakerTags[i];
                speakerTag.color = SegmentColors[Object.keys(SegmentColors)[colorCounter]];

                if (colorCounter >= speakerTags.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }
            
            colorCounter = 0;
            for (let i in textTags) {
                let textTag = textTags[i];
                textTag.color = TagColors[Object.keys(TagColors)[colorCounter]];

                if (colorCounter >= speakerTags.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }

            colorCounter = speakerTags.length - 1;
            for (let i in unpairedTags) {
                let unpairedTag = unpairedTags[i];
                unpairedTag.color = TagColors[Object.keys(TagColors)[colorCounter]];

                if (colorCounter >= unpairedTag.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }

            return {
                speakerTags: speakerTags,
                segmentTags: action.payload.segmentTags,
                textTags: textTags,
                segments: segments,
                unpairedTags: unpairedTags,
                type: "TRANSCRIPT_INITIALIZE"
            };
        case "TRANSCRIPT_SEGMENT_UPDATE":
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_UPDATE",
                segments: state.segments.map(
                    segment => segment.id === action.payload.segmentId ?
                        {...segment, 
                            start: (action.payload.segmentStart ? action.payload.segmentStart : segment.start),
                            end: (action.payload.segmentEnd ? action.payload.segmentEnd : segment.end),
                            speaker: ((action.payload.segmentSpeakerId || action.payload.segmentSpeakerId === "") ? action.payload.segmentSpeakerId : segment.speaker),
                            segmentTags: (action.payload.segmentTags ? action.payload.segmentTags : segment.segmentTags)
                        }
                    : segment
                )
            };
        case "TRANSCRIPT_SEGMENT_DELETE":
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_DELETE",
                segments: state.segments.filter((segment) => segment.id !== action.payload)
            };
        case "TRANSCRIPT_SEGMENT_CREATE":
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_CREATE",
                segments: [...state.segments, {
                    start: action.payload.segmentStart,
                    end: action.payload.segmentEnd,
                    id: action.payload.segmentId,
                    speaker: "",
                    words: []
                }]
            };
        case "TRANSCRIPT_SPEAKER_CREATE":
            return {
                ...state,
                type: "TRANSCRIPT_SPEAKER_CREATE",
                speakerTags: [ ...state.speakerTags, {id: action.payload.speakerId, label: action.payload.speakerLabel, color: SegmentColors[Object.keys(SegmentColors)[state.speakerTags.length]]}]
            };
        case "TRANSCRIPT_SPEAKER_UPDATE":
            return {
                ...state,
                type: "TRANSCRIPT_SPEAKER_UPDATE",
                speakerTags: state.speakerTags.map(
                    tag => tag.id === action.payload.speakerId ?
                        {...tag, 
                            label: action.payload.speakerLabel
                        }
                    : tag
                )
            };
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;