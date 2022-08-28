type Action = {
    componentName: string,
    segmentId?: string,
};

const initialState = {
    actionUndos: [] as Action[],
    actionRedos: [] as Action[],
    lastSwappedAction: null
};

const HistoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "HISTORY_ADD_ACTION":
            var newActionRedos = JSON.parse(JSON.stringify(state.actionRedos));

            var actionType = action.payload.actionType;
            var componentName = action.payload.componentName;
            var segmentId = action.payload.segmentId;
            if (componentName == "AnnotationTextSegment" && actionType !== null && actionType == "REMOVE") {
                // Remove all redos of the deleted segment, only its undos are kept.
                newActionRedos = newActionRedos.filter((a: { segmentId: any; }) => a.segmentId !== segmentId);
            }
            return {
                ...state,
                actionUndos: [...state.actionUndos, {componentName: action.payload.componentName, segmentId: action.payload.segmentId}],
                actionRedos: newActionRedos,
                type: "HISTORY_ADD_ACTION"
            };
        case "HISTORY_UNDO_ACTION":
            var undosLength = state.actionUndos.length;
            if (undosLength === 0) return state;
            var actionToUndo = state.actionUndos[undosLength - 1];

            return {
                ...state,
                type: "HISTORY_UNDO_ACTION",
                actionRedos: [...state.actionRedos, actionToUndo],
                actionUndos: state.actionUndos.filter((_a, index: number) => index !== undosLength - 1),
                lastSwappedAction: actionToUndo
            };
        case "HISTORY_REDO_ACTION":
            var redosLength = state.actionRedos.length;
            if (redosLength === 0) return state;
            var actionToRedo = state.actionRedos[redosLength - 1];

            return {
                ...state,
                type: "HISTORY_REDO_ACTION",
                actionUndos: [...state.actionUndos, actionToRedo],
                actionRedos: state.actionRedos.filter((_a, index: number) => index !== redosLength - 1),
                lastSwappedAction: actionToRedo
            };
        default:
            return state;
    }
}

export default HistoryReducer;