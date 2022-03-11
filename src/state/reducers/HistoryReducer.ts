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
            return {
                actionHistory: [...state.actionHistory, {componentName: action.payload.componentName, segmentId: action.payload.segmentId}],
                currentActionIndex: state.currentActionIndex + 1,
                type: "HISTORY_ADD_ACTION"
            };
        case "HISTORY_UNDO_ACTION":
            if (state.currentActionIndex === -1) return state;

            return {
                type: "HISTORY_UNDO_ACTION",
                currentActionIndex: state.currentActionIndex - 1,
                actionHistory: state.actionHistory
            };
        case "HISTORY_REDO_ACTION":
            if (state.currentActionIndex === state.actionHistory.length - 1) return state;

            return {
                type: "HISTORY_REDO_ACTION",
                currentActionIndex: state.currentActionIndex + 1,
                actionHistory: state.actionHistory
            };
        case "HISTORY_DELETE_SEGMENT_ACTIONS":
            var newCurrentActionIndex = state.currentActionIndex;
            var newActionHistory = state.actionHistory.filter(a => a.segmentId !== action.payload);

            console.log(newActionHistory)

            while (newActionHistory[newCurrentActionIndex] === undefined) {
                if (newCurrentActionIndex === -1) {
                    break;
                }
                newCurrentActionIndex--;
            }

            console.log(newCurrentActionIndex)
            return {
                type: "HISTORY_DELETE_SEGMENT_ACTIONS",
                currentActionIndex: newCurrentActionIndex,
                actionHistory: newActionHistory
            };
        default:
            return state;
    }
}

export default HistoryReducer;