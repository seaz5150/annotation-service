const initialState = {
    segmentId: null
};

const AudioPlayReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "AUDIO_PLAY_SEGMENT":
            return {
                segmentId: action.payload.segmentId
            };
        default:
            return state;
    }
}

export default AudioPlayReducer;