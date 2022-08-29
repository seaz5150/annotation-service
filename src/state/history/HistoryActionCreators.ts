export const createActionHistoryAddAction = (componentName: string, segmentId?: string, actionType?: string, additionalSegmentId?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_ADD_ACTION",
      payload: {
        componentName: componentName,
        segmentId: segmentId,
        actionType: actionType,
        additionalSegmentId: additionalSegmentId
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