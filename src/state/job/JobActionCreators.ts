export const createActionJobInitialize = (jobData: {}) => {
  return (dispatch: any) => {
    dispatch({
      type: "JOB_INITIALIZE",
      payload: jobData
    })
  }
}