const initialState = {
    segmentId: null,
    time: null,
    type: null
};

const AudioPlayReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "AUDIO_PLAY_SEGMENT":
            return {
                segmentId: action.payload.segmentId,
                type: "AUDIO_PLAY_SEGMENT"
            };
        case "AUDIO_PLAY_FROM_TIME":
            return {
                time: action.payload.time,
                type: "AUDIO_PLAY_FROM_TIME"
            };
        default:
            return state;
    }
}

export default AudioPlayReducer;