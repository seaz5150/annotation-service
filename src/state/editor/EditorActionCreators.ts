export const createActionEditorAddSectionTag = (tagId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_ADD_SECTION_TAG",
      payload: tagId
    })
  }
}

export const createActionEditorAddUnpairedTag = (tagId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_ADD_UNPAIRED_TAG",
      payload: tagId
    })
  }
}

export const createActionEditorRequestDataSave = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REQUEST_DATA_SAVE",
      payload: segmentId
    })
  }
}

export const createActionEditorPopData = (segmentId: string, order: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_POP_DATA",
      payload: {
        segmentId: segmentId,
        order: order
      }
    })
  }
}

export const createActionEditorReinitializeWords = (segmentIds: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REINITIALIZE_WORDS",
      payload: segmentIds
    })
  }
}

export const createActionEditorReinitializeWordsFromSaved = (segmentIds: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REINITIALIZE_WORDS_FROM_SAVED",
      payload: segmentIds
    })
  }
}

export const createActionEditorSaveData = (segmentId: string, history: any, value: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_SAVE_DATA",
      payload: {
        segmentId: segmentId,
        history: history,
        value: value
      }
    })
  }
}

export const createActionEditorSetFocusedEditor = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_SET_FOCUSED_EDITOR",
      payload: segmentId
    })
  }
}