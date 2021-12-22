import { combineReducers } from "redux";
import AudioPlayReducer from "./AudioPlayReducer";
import RecordingTranscriptReducer from "./RecordingTranscriptReducer";
import ReferenceReducer from "./ReferenceReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer,
    recordingTranscript: RecordingTranscriptReducer,
    references: ReferenceReducer
});

export default reducers;