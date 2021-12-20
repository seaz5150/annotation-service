import { v4 as uuidv4 } from "uuid";
import { SegmentColors } from "../../enums/SegmentColors"

const initialState = {
    speakerTags: null,
    segmentTags: null,
    textTags: null,
    segments: null
};

var usedColors = [] as number[];

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "TRANSCRIPT_INITIALIZE":
            var segments = action.payload.segments;
            var speakerTags = action.payload.speakerTags;

            for (var segment in segments) {
                var segmentObj = segments[segment];
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
            for (var speakerTag in speakerTags) {
                var speakerTagObj = speakerTags[speakerTag];

                // https://stackoverflow.com/questions/33026791/how-do-i-get-a-random-value-from-enums-in-javascript
                var foundUniqueColor = false;
                var random = Math.floor(Math.random() * Object.keys(SegmentColors).length);

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
                var randomColor = SegmentColors[Object.keys(SegmentColors)[random]];
                speakerTagObj.color = randomColor;
            }
            return {
                speakerTags: speakerTags,
                segmentTags: action.payload.segmentTags,
                textTags: action.payload.textTags,
                segments: segments
            };
        case "TRANSCRIPT_SEGMENT_UPDATE":
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;