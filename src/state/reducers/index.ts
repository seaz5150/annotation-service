import { combineReducers } from "redux";
import AudioPlayReducer from "./AudioPlayReducer";
import RecordingTranscriptReducer from "./RecordingTranscriptReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer,
    recordingTranscript: RecordingTranscriptReducer
});

export default reducers;