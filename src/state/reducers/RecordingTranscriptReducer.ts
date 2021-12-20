import { v4 as uuidv4 } from "uuid";

const initialState = {
    speakerTags: null,
    segmentTags: null,
    textTags: null,
    segments: null
};

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "RECORDING_TRANSCRIPT_INITIALIZE":
            // Add unique IDs to the segments before saving them to the store.
            var segmentsTemp = action.payload.segments;
            for (var segment in segmentsTemp) {
                var segmentObj = segmentsTemp[segment];
                segmentObj.id = uuidv4();
            }
            return {
                speakerTags: action.payload.speakerTags,
                segmentTags: action.payload.segmentTags,
                textTags: action.payload.textTags,
                segments: segmentsTemp
            };
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;