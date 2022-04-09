const initialState = {
    segmentRefs: [] as any[],
};


const ReferenceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "SEGMENT_REFERENCES_INITIALIZE":
            return {
                segmentRefs: action.payload
            };
        default:
            return state;
    }
}

export default ReferenceReducer;