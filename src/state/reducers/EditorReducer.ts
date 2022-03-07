const initialState = {
    tagId: null
};

const EditorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "EDITOR_ADD_SECTION_TAG":
            return {
                tagId: action.payload,
                type: "EDITOR_ADD_SECTION_TAG"
            };
        default:
            return state;
    }
}

export default EditorReducer;