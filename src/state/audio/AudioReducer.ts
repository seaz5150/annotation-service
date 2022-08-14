import { getFromLS, saveToLS } from "../../utils/CommonUtilities";

const initialState = {
    time: null,
    type: null,
    prePlay: (getFromLS("prePlay") ? getFromLS("prePlay") as number : null),

    // For the ability to pause and resume segment play.
    currentTime: null,
    currentlyPlayingSegmentId: null,
    segmentPauseTime: null,
    pausedSegmentId: null
};

const AudioPlayReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "AUDIO_SET_CURRENT_TIME":
            return {
                ...state,
                currentTime: action.payload,
                type: "AUDIO_SET_CURRENT_TIME"
            };
        case "AUDIO_PAUSE_SEGMENT":
            return {
                ...state,
                segmentPauseTime: state.currentTime,
                pausedSegmentId: action.payload.segmentId,
                currentlyPlayingSegmentId: null,
                type: "AUDIO_PAUSE_SEGMENT"
            };
        case "AUDIO_CLEAR_PLAYING_SEGMENT":
            return {
                ...state,
                currentlyPlayingSegmentId: null,
                type: "AUDIO_CLEAR_PLAYING_SEGMENT"
            };
        case "AUDIO_CLEAR_PAUSED_SEGMENT":
            return {
                ...state,
                pausedSegmentId: null,
                segmentPauseTime: null,
                type: "AUDIO_CLEAR_PAUSED_SEGMENT"
            };
        case "AUDIO_PLAY_SEGMENT":
            return {
                ...state,
                currentlyPlayingSegmentId: action.payload.segmentId,
                type: "AUDIO_PLAY_SEGMENT"
            };
        case "AUDIO_PLAY_FROM_TIME":
            return {
                ...state,
                time: action.payload.time,
                type: "AUDIO_PLAY_FROM_TIME"
            };
        case "AUDIO_SET_PREPLAY":
            saveToLS("prePlay", action.payload);
            return {
                ...state,
                prePlay: action.payload,
                type: "AUDIO_SET_PREPLAY"
            };
        case "AUDIO_TOGGLE_PLAY":
            return {
                ...state,
                type: "AUDIO_TOGGLE_PLAY"
            };
        default:
            return state;
    }
}

export default AudioPlayReducer;