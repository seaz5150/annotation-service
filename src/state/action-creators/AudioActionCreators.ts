export const createActionAudioPlaySegment = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_PLAY_SEGMENT",
      payload: {
        segmentId: segmentId
      }
    })
  }
}

export const createActionAudioPlayFromTime = (time: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_PLAY_FROM_TIME",
      payload: {
        time: time
      }
    })
  }
}

export const createActionAudioPlaySetPreplay = (prePlay: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_SET_PREPLAY",
      payload: prePlay
    })
  }
}

export const createActionAudioTogglePlay = () => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_TOGGLE_PLAY",
      payload: null
    })
  }
}