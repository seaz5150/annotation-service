import { store } from '../Store'

export const createActionJobInitialize = (jobData: {}) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_INITIALIZE",
      payload: jobData
    })
  }
}

export const createActionJobSaveChanges = () => {
  if (store.getState().history.currentActionIndex === (store.getState().job as any).saveActionIndex) {
    return;
  }

  return (dispatch: any) => {
    dispatch({
      type: "JOB_SAVE_CHANGES",
      payload: null
    })
  }
}

export const createActionJobSetSaveActionIndex = (actionIndex: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_SET_SAVE_ACTION_INDEX",
      payload: actionIndex
    })
  }
}

export const createActionJobToggleAutosave = (value: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_TOGGLE_AUTOSAVE",
      payload: value
    })
  }
}

export const createActionJobSetAutosaveInterval = (interval: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_SET_AUTOSAVE_INTERVAL",
      payload: interval
    })
  }
}