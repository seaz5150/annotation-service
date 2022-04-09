import { combineReducers } from "redux";
import AudioPlayReducer from "./audio/AudioReducer";
import TranscriptReducer from "./transcript/TranscriptReducer";
import ReferenceReducer from "./reference/ReferenceReducer";
import EditorReducer from "./editor/EditorReducer";
import HistoryReducer from "./history/HistoryReducer";
import DashboardReducer from "./dashboard/DashboardReducer";
import JobReducer from "./job/JobReducer";
import HotkeyReducer from "./hotkey/HotkeyReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer,
    recordingTranscript: TranscriptReducer,
    references: ReferenceReducer,
    editor: EditorReducer,
    history: HistoryReducer,
    dashboard: DashboardReducer,
    job: JobReducer,
    hotkey: HotkeyReducer
});

export default reducers;