import { combineReducers } from "redux";
import AudioPlayReducer from "./AudioPlayReducer";
import RecordingTranscriptReducer from "./RecordingTranscriptReducer";
import ReferenceReducer from "./ReferenceReducer";
import EditorReducer from "./EditorReducer";
import HistoryReducer from "./HistoryReducer";
import DashboardReducer from "./DashboardReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer,
    recordingTranscript: RecordingTranscriptReducer,
    references: ReferenceReducer,
    editor: EditorReducer,
    history: HistoryReducer,
    dashboard: DashboardReducer
});

export default reducers;