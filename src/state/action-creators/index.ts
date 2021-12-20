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

export const createActionRecordingTranscriptInitialize = (transcript: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "RECORDING_TRANSCRIPT_INITIALIZE",
      payload: transcript
    })
  }
}