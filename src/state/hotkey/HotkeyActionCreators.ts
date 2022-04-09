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