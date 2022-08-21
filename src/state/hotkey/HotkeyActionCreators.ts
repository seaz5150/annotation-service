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

// Reset hotkeys to default.
export const createActionHotkeyReset = () => {
  return (dispatch: any) => {
    dispatch({
      type: "HOTKEY_RESET",
      payload: null
    })
  }
}

// Adds hotkeys for tagging current selection.
export const createActionHotkeyAddTextTags = (textTags: any[], unpairedTags: any[]) => {
  return (dispatch: any) => {
    dispatch({
      type: "HOTKEY_ADD_TEXT_TAGS",
      payload: {
        textTags: textTags,
        unpairedTags: unpairedTags
      }
    })
  }
}