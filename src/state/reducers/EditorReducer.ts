const initialState = {
    tagId: null,
    segmentId: null
};

const EditorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "EDITOR_ADD_SECTION_TAG":
            return {
                tagId: action.payload,
                type: "EDITOR_ADD_SECTION_TAG"
            };
        case "EDITOR_ADD_UNPAIRED_TAG":
            return {
                tagId: action.payload,
                type: "EDITOR_ADD_UNPAIRED_TAG"
            };
        default:
            return state;
    }
}

export default EditorReducer;