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
            // Add unique IDs and random colors to the segments before saving them to the store.
            var segments = action.payload.segments;
            for (var segment in action.payload.segments) {
                var segmentObj = segments[segment];
                segmentObj.id = uuidv4();

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
                console.log(randomColor);
                segmentObj.color = randomColor;
            }
            return {
                speakerTags: action.payload.speakerTags,
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