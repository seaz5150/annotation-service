const initialState = {
    start: null,
    end: null
};

const AudioPlayReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "AUDIO_PLAY_SEGMENT":
            return {
                start: action.payload.start,
                end: action.payload.end
            };
        default:
            return state;
    }
}

export default AudioPlayReducer;