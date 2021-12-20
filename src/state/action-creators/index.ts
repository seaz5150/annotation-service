export const createActionAudioPlaySegment = (start: number, end?: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_PLAY_SEGMENT",
      payload: {
        start: start,
        end: end
      }
    })
  }
}