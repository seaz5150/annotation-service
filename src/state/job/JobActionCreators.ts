export const createActionJobInitialize = (jobData: {}) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_INITIALIZE",
      payload: jobData
    })
  }
}

export const createActionJobListInitialize = (jobList: {}) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_LIST_INITIALIZE",
      payload: jobList
    })
  }
}

export const createActionJobNext = () => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_NEXT"
    })
  }
}

export const createActionJobPrevious = () => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_PREVIOUS"
    })
  }
}