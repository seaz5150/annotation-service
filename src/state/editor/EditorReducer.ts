const initialState = {
    tagId: null,
    segmentId: null,
    editorData: [] as any[],
    segmentIds: [],
    focusedEditorSegmentId: null
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
        case "EDITOR_REINITIALIZE_WORDS":
            return {
                ...state,
                segmentIds: action.payload,
                type: "EDITOR_REINITIALIZE_WORDS"
            };
        case "EDITOR_REINITIALIZE_WORDS_FROM_SAVED":
            return {
                ...state,
                segmentIds: action.payload,
                type: "EDITOR_REINITIALIZE_WORDS_FROM_SAVED"
            };
        case "EDITOR_SET_FOCUSED_EDITOR":
            return {
                ...state,
                focusedEditorSegmentId: action.payload,
                type: "EDITOR_SET_FOCUSED_EDITOR"
            };
        case "EDITOR_REQUEST_DATA_SAVE":
            return {
                ...state,
                segmentId: action.payload,
                type: "EDITOR_REQUEST_DATA_SAVE"
            };
        case "EDITOR_POP_DATA":
            var resultData = JSON.parse(JSON.stringify(state.editorData));
            resultData = resultData.filter((d: { id: string; order: number; }) => !(d.id === action.payload.segmentId && d.order === action.payload.order));

            return {
                ...state,
                segmentId: action.payload.segmentId,
                editorData: resultData,
                type: "EDITOR_POP_DATA"
            };
        case "EDITOR_SAVE_DATA":
            var resultData = JSON.parse(JSON.stringify(state.editorData));
            var segmentData = resultData.filter((d: { id: string; }) => d.id === action.payload.segmentId);

            var newOrder = 0;
            if (segmentData && segmentData.length > 0) {
                var mostRecentSegmentData = segmentData.reduce((previous: { order: number; }, current: { order: number; }) => (+previous.order > +current.order) ? previous : current);
                if (mostRecentSegmentData) {
                    newOrder = mostRecentSegmentData.order + 1;
                }
            }

            return {
                ...state,
                editorData: [...state.editorData, {id: action.payload.segmentId, history: action.payload.history, value: action.payload.value, order: newOrder}],
                type: "EDITOR_SAVE_DATA"
            };
        default:
            return state;
    }
}

export default EditorReducer;