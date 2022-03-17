const initialState = {
    segmentId: null,
    time: null,
    type: null,
    prePlay: 0
};

const AudioPlayReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "AUDIO_PLAY_SEGMENT":
            return {
                ...state,
                segmentId: action.payload.segmentId,
                type: "AUDIO_PLAY_SEGMENT"
            };
        case "AUDIO_PLAY_FROM_TIME":
            return {
                ...state,
                time: action.payload.time,
                type: "AUDIO_PLAY_FROM_TIME"
            };
        case "AUDIO_PLAY_SET_PREPLAY":
            return {
                ...state,
                prePlay: action.payload,
                type: "AUDIO_PLAY_SET_PREPLAY"
            };
        default:
            return state;
    }
}

export default AudioPlayReducer;