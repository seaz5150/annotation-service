import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SegmentColors } from "../../enums/SegmentColors"
import { TagColors } from "../../enums/TagColors";

const initialState = {
    speakerTags: null,
    segmentTags: null,
    textTags: null,
    segments: [] as any[]
};

var usedColors = [] as number[];

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "TRANSCRIPT_INITIALIZE":
            var segments = action.payload.segments;
            var speakerTags = action.payload.speakerTags;
            var textTags = action.payload.textTags;

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

            // Add unique (if possible) colors to speaker tags.
            for (let speakerTag in speakerTags) {
                let speakerTagObj = speakerTags[speakerTag];

                // https://stackoverflow.com/questions/33026791/how-do-i-get-a-random-value-from-enums-in-javascript
                let foundUniqueColor = false;
                let random = Math.floor(Math.random() * Object.keys(SegmentColors).length);

                // Look for a unique color only if all of the colors are not yet taken.
                if (!(usedColors.length === Object.keys(SegmentColors).length)) {
                    while (!foundUniqueColor) {
                        random = Math.floor(Math.random() * Object.keys(SegmentColors).length);
                        if (!usedColors.includes(random)) {
                            foundUniqueColor = true;
                            usedColors.push(random);
                        }
                    }
                }
                let randomColor = SegmentColors[Object.keys(SegmentColors)[random]];
                speakerTagObj.color = randomColor;
            }

            // Add unique (if possible) colors to text tags.
            for (let index in textTags) {
                let textTag = textTags[index];

                let foundUniqueColor = false;
                let random = Math.floor(Math.random() * Object.keys(TagColors).length);

                // Look for a unique color only if all of the colors are not yet taken.
                if (!(usedColors.length === Object.keys(TagColors).length)) {
                    while (!foundUniqueColor) {
                        random = Math.floor(Math.random() * Object.keys(TagColors).length);
                        if (!usedColors.includes(random)) {
                            foundUniqueColor = true;
                            usedColors.push(random);
                        }
                    }
                }
                let randomColor = TagColors[Object.keys(TagColors)[random]];
                textTag.color = randomColor;
            }

            return {
                speakerTags: speakerTags,
                segmentTags: action.payload.segmentTags,
                textTags: textTags,
                segments: segments,
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
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;