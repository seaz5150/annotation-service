import { combineReducers } from "redux";
import AudioPlayReducer from "./AudioPlayReducer";

const reducers = combineReducers({
    audioPlay: AudioPlayReducer
});

export default reducers;