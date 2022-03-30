const initialState = {
    hotkeys: [{name: "SAVE", hotkey: "Ctrl/Cmd + S", label: "Save transcript"}],
    rebindInProgress: false
};


const HotkeyReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "HOTKEY_SET_REBIND_IN_PROGRESS":
            return {
                ...state,
                rebindInProgress: action.payload
            };
        case "HOTKEY_SET":
            let newHotkeys = JSON.parse(JSON.stringify(state.hotkeys));
            let foundHotkey = newHotkeys.find((h: { name: any; }) => h.name === action.payload.name);
            foundHotkey.hotkey = action.payload.hotkey;

            return {
                ...state,
                hotkeys: newHotkeys
            };
        default:
            return state;
    }
}

export default HotkeyReducer;