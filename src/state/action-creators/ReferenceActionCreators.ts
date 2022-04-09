export const createActionSegmentReferencesInitialize = (segmentRefs: any[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "SEGMENT_REFERENCES_INITIALIZE",
      payload: segmentRefs
    })
  }
}