// Plays the segment with given ID.
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

// Plays the audio from given time.
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

// Sets amount of time that the audio will be played earlier when playing a segment.
export const createActionAudioPlaySetPreplay = (prePlay: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_SET_PREPLAY",
      payload: prePlay
    })
  }
}

// Toggles playing of the audio.
export const createActionAudioTogglePlay = () => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_TOGGLE_PLAY",
      payload: null
    })
  }
}

export const createActionAudioSetCurrentTime = (time: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_SET_CURRENT_TIME",
      payload: time
    })
  }
}

export const createActionAudioPauseSegment = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_PAUSE_SEGMENT",
      payload: {
        segmentId: segmentId
      }
    })
  }
}

export const createActionAudioClearPlayingSegment = () => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_CLEAR_PLAYING_SEGMENT",
      payload: null
    })
  }
}

export const createActionAudioClearPausedSegment = () => {
  return (dispatch: any) => {
    dispatch({
      type: "AUDIO_CLEAR_PAUSED_SEGMENT",
      payload: null
    })
  }
}