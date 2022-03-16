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

export const createActionTranscriptPlayerAddAction = (actionType: string, segmentAfter: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_PLAYER_ADD_ACTION",
      payload: {
        actionType: actionType,
        segmentAfter: segmentAfter
      }
    })
  }
}

export const createActionTranscriptPlayerUndoAction = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_PLAYER_UNDO_ACTION",
      payload: null
    })
  }
}

export const createActionTranscriptPlayerRedoAction = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_PLAYER_REDO_ACTION",
      payload: null
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

export const createActionEditorRequestDataSave = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REQUEST_DATA_SAVE",
      payload: segmentId
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

export const createActionDashboardToggleModule = (moduleName: string, value: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_TOGGLE_MODULE",
      payload: {
        moduleName: moduleName,
        value: value
      }
    })
  }
}

export const createActionDashboardInitializeModules = (modules: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_INITIALIZE_MODULES",
      payload: modules
    })
  }
}

export const createActionDashboardInitializeOpenModules = (modules: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_INITIALIZE_OPEN_MODULES",
      payload: modules
    })
  }
}

export const createActionDashboardResetLayout = () => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_RESET_LAYOUT",
      payload: null
    })
  }
}