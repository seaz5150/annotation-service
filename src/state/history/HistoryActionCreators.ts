export const createActionHistoryAddAction = (componentName: string, segmentId?: string, actionType?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_ADD_ACTION",
      payload: {
        componentName: componentName,
        segmentId: segmentId,
        actionType: actionType
      }
    })
  }
}

export const createActionHistoryUndoAction = () => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_UNDO_ACTION",
      payload: null
    })
  }
}

export const createActionHistoryRedoAction = () => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_REDO_ACTION",
      payload: null
    })
  }
}