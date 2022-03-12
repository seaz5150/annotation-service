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

export const createActionTranscriptInitialize = (transcript: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INITIALIZE",
      payload: transcript
    })
  }
}

export const createActionTranscriptSegmentUpdate = (segmentId: string, segmentStart?: number, segmentEnd?: number, segmentSpeakerId?: string, segmentTags?: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SEGMENT_UPDATE",
      payload: {
        segmentId: segmentId,
        segmentStart: segmentStart,
        segmentEnd: segmentEnd,
        segmentSpeakerId: segmentSpeakerId,
        segmentTags: segmentTags
      }
    })
  }
}

export const createActionTranscriptSegmentDelete = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SEGMENT_DELETE",
      payload: segmentId
    })
  }
}

export const createActionSegmentReferencesInitialize = (segmentRefs: any[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "SEGMENT_REFERENCES_INITIALIZE",
      payload: segmentRefs
    })
  }
}

export const createActionTranscriptSegmentCreate = (segmentId: string, segmentStart: number, segmentEnd: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SEGMENT_CREATE",
      payload: {
        segmentStart: segmentStart,
        segmentEnd: segmentEnd,
        segmentId: segmentId,
      }
    })
  }
}

export const createActionTranscriptSpeakerCreate = (speakerId: string, speakerLabel: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SPEAKER_CREATE",
      payload: {
        speakerId: speakerId,
        speakerLabel: speakerLabel
      }
    })
  }
}

export const createActionTranscriptSpeakerUpdate = (speakerId: string, speakerLabel: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SPEAKER_UPDATE",
      payload: {
        speakerId: speakerId,
        speakerLabel: speakerLabel
      }
    })
  }
}

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

export const createActionHistoryAddAction = (componentName: string, segmentId?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_ADD_ACTION",
      payload: {
        componentName: componentName,
        segmentId: segmentId
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

export const createActionHistoryDeleteSegmentActions = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "HISTORY_DELETE_SEGMENT_ACTIONS",
      payload: segmentId
    })
  }
}

export const createActionDashboardOpenModule = (moduleName: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_OPEN_MODULE",
      payload: moduleName
    })
  }
}

export const createActionDashboardCloseModule = (moduleName: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_CLOSE_MODULE",
      payload: moduleName
    })
  }
}