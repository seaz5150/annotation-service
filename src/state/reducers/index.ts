import { combineReducers } from "redux";
import AudioPlayReducer from "./AudioPlayReducer";
import RecordingTranscriptReducer from "./RecordingTranscriptReducer";
import ReferenceReducer from "./ReferenceReducer";
import EditorReducer from "./EditorReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer,
    recordingTranscript: RecordingTranscriptReducer,
    references: ReferenceReducer,
    editor: EditorReducer,
});

export default reducers;