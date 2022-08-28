type Action = {
    componentName: string,
    segmentId?: string,
};

const initialState = {
    actionHistory: [] as Action[],
    currentActionIndex: -1
};

const HistoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "HISTORY_ADD_ACTION":
            var newActionHistory;

            var actionType = action.payload.actionType;
            var componentName = action.payload.componentName;
            var segmentId = action.payload.segmentId;
            if (componentName == "AnnotationTextSegment" && actionType !== null && actionType == "REMOVE") {
                // Remove all redos of the deleted segment, only its undos are kept.
                newActionHistory = JSON.parse(JSON.stringify(state.actionHistory));
                newActionHistory = newActionHistory.filter((a: { segmentId: any; }, index: number) => (a.segmentId !== segmentId || a.segmentId === segmentId && index <= state.currentActionIndex));
                newActionHistory = [...newActionHistory, {componentName: action.payload.componentName, segmentId: action.payload.segmentId}];
            }
            else {
                newActionHistory = [...state.actionHistory, {componentName: action.payload.componentName, segmentId: action.payload.segmentId}];
            }
            return {
                ...state,
                actionHistory: newActionHistory,
                currentActionIndex: state.currentActionIndex + 1,
                type: "HISTORY_ADD_ACTION"
            };
        case "HISTORY_UNDO_ACTION":
            if (state.currentActionIndex === -1) return state;

            return {
                ...state,
                type: "HISTORY_UNDO_ACTION",
                currentActionIndex: state.currentActionIndex - 1,
                actionHistory: state.actionHistory
            };
        case "HISTORY_REDO_ACTION":
            if (state.currentActionIndex === state.actionHistory.length - 1) return state;

            return {
                ...state,
                type: "HISTORY_REDO_ACTION",
                currentActionIndex: state.currentActionIndex + 1,
                actionHistory: state.actionHistory
            };
        default:
            return state;
    }
}

export default HistoryReducer;