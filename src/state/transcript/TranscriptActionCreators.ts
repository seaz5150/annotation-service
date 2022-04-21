import { store } from '../Store'

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

export const createActionTranscriptConstructFullTranscript = () => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_CONSTRUCT_FULL_TRANSCRIPT",
      payload: null
    })
  }
}

export const createActionTranscriptSetSaveActionIndex = (actionIndex: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SET_SAVE_ACTION_INDEX",
      payload: actionIndex
    })
  }
}

export const createActionTranscriptSaveChanges = () => {
  if (store.getState().history.currentActionIndex === (store.getState().recordingTranscript as any).saveActionIndex) {
    return (dispatch: any) => {
      dispatch({
        type: "TRANSCRIPT_SKIP_SAVE_CHANGES",
        payload: null
      })
    }
  }

  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SAVE_CHANGES",
      payload: null
    })
  }
}

export const createActionTranscriptToggleAutosave = (value: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_TOGGLE_AUTOSAVE",
      payload: value
    })
  }
}

export const createActionTranscriptSetAutosaveInterval = (interval: number) => {
  return (dispatch: any) => {
    dispatch({
      type: "TRANSCRIPT_SET_AUTOSAVE_INTERVAL",
      payload: interval
    })
  }
}