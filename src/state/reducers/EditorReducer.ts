const initialState = {
    tagId: null,
    segmentId: null,
    editorData: [] as any[]
};

const EditorReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "EDITOR_ADD_SECTION_TAG":
            return {
                ...state,
                tagId: action.payload,
                type: "EDITOR_ADD_SECTION_TAG"
            };
        case "EDITOR_ADD_UNPAIRED_TAG":
            return {
                ...state,
                tagId: action.payload,
                type: "EDITOR_ADD_UNPAIRED_TAG"
            };
        case "EDITOR_REQUEST_DATA_SAVE":
            return {
                ...state,
                segmentId: action.payload,
                type: "EDITOR_REQUEST_DATA_SAVE"
            };
        case "EDITOR_SAVE_DATA":   
            if (action.payload.history.undos.length === 0 && action.payload.history.redos.length === 0) {
                return state;
            }

            var itemToUpdate;
            if (itemToUpdate = state.editorData.find((item: { id: any; }) => item.id === action.payload.segmentId)) {
                itemToUpdate.history = action.payload.history;
                itemToUpdate.value = action.payload.value;
            }

            return {
                ...state,
                editorData: itemToUpdate ? state.editorData : [...state.editorData, {id: action.payload.segmentId, history: action.payload.history, value: action.payload.value}],
                type: "EDITOR_SAVE_DATA"
            };
        default:
            return state;
    }
}

export default EditorReducer;