const initialState = {
    tagId: null,
    segmentId: null,
    editorHistories: [] as any[]
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
        case "EDITOR_REQUEST_HISTORY_SAVE":
            return {
                ...state,
                segmentId: action.payload,
                type: "EDITOR_REQUEST_HISTORY_SAVE"
            };
        case "EDITOR_SAVE_HISTORY":   
            if (action.payload.history.undos.length === 0 && action.payload.history.redos.length === 0) {
                return state;
            }

            var itemToUpdate;
            if (itemToUpdate = state.editorHistories.find((item: { id: any; }) => item.id === action.payload.segmentId)) {
                itemToUpdate.history = action.payload.history;
            }

            return {
                ...state,
                editorHistories: itemToUpdate ? state.editorHistories : [...state.editorHistories, {id: action.payload.segmentId, history: action.payload.history}],
                type: "EDITOR_SAVE_HISTORY"
            };
        default:
            return state;
    }
}

export default EditorReducer;