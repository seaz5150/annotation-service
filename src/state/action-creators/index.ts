import { store } from '../Store'

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
      type: "AUDIO_PLAY_SET_PREPLAY",
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

export const createActionTranscriptInitialize = (transcript: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INITIALIZE",
      payload: transcript
    })
  }
}

export const createActionTranscriptSegmentUpdate = (segmentId: string, segmentStart?: number, segmentEnd?: number, segmentSpeakerId?: string, segmentTags?: string[], segmentWords?: any[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SEGMENT_UPDATE",
      payload: {
        segmentId: segmentId,
        segmentStart: segmentStart,
        segmentEnd: segmentEnd,
        segmentSpeakerId: segmentSpeakerId,
        segmentTags: segmentTags,
        segmentWords: segmentWords
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

export const createActionTranscriptSegmentsShift = (shiftAmount: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SEGMENTS_SHIFT",
      payload: shiftAmount
    })
  }
}

export const createActionTranscriptInitializeLength = (length: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INITIALIZE_LENGTH",
      payload: length
    })
  }
}

export const createActionTranscriptMergeSegments = (segmentId: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_MERGE_SEGMENTS",
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

export const createActionTranscriptPlayerAddAction = (actionType: string, segmentBefore: any | undefined, segmentAfter: any, additionalSegment?: any) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_PLAYER_ADD_ACTION",
      payload: {
        actionType: actionType,
        segmentBefore: segmentBefore,
        segmentAfter: segmentAfter,
        additionalSegment: additionalSegment
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

export const createActionTranscriptUpdateWords = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_UPDATE_WORDS",
      payload: null
    })
  }
}

export const createActionTranscriptIncreaseAmountUpdated = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INCREASE_AMOUNT_UPDATED",
      payload: null
    })
  }
}

export const createActionTranscriptResetAmountUpdated = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_RESET_AMOUNT_UPDATED",
      payload: null
    })
  }
}

export const createActionTranscriptGatherSplitInfo = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_GATHER_SPLIT_INFO",
      payload: null
    })
  }
}

export const createActionTranscriptInputPlayerSplitInfo = (segmentId: string, time: number | undefined) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INPUT_PLAYER_SPLIT_INFO",
      payload: {
        segmentId: segmentId,
        time: time
      }
    })
  }
}

export const createActionTranscriptInputEditorSplitInfo = (segmentId: string, wordIndex: number, splitWord: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_INPUT_EDITOR_SPLIT_INFO",
      payload: {
        segmentId: segmentId,
        wordIndex: wordIndex,
        splitWord: splitWord
      }
    })
  }
}

export const createActionTranscriptSplitSegment = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SPLIT_SEGMENT",
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

export const createActionEditorPopData = (segmentId: string, order: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_POP_DATA",
      payload: {
        segmentId: segmentId,
        order: order
      }
    })
  }
}

export const createActionEditorReinitializeWords = (segmentIds: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REINITIALIZE_WORDS",
      payload: segmentIds
    })
  }
}

export const createActionEditorReinitializeWordsFromSaved = (segmentIds: string[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "EDITOR_REINITIALIZE_WORDS_FROM_SAVED",
      payload: segmentIds
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

export const createActionDashboardToggleModuleStatic = (moduleName: string, value: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_TOGGLE_MODULE_STATIC",
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

export const createActionDashboardToggleLockLayout = () => {
  return (dispatch: any) => {
    dispatch({
      type: "DASHBOARD_TOGGLE_LOCK_LAYOUT",
      payload: null
    })
  }
}

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

export const createActionHotkeySet = (name: string, hotkey: string) => {
  return (dispatch: any) => {
    dispatch({
      type: "HOTKEY_SET",
      payload: {
        name: name,
        hotkey: hotkey
      }
    })
  }
}

export const createActionHotkeySetRebindInProgress = (value: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "HOTKEY_SET_REBIND_IN_PROGRESS",
      payload: value
    })
  }
}

export const createActionHotkeyReset = () => {
  return (dispatch: any) => {
    dispatch({
      type: "HOTKEY_RESET",
      payload: null
    })
  }
}