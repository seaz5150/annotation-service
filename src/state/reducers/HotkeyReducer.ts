import { getFromLS, saveToLS } from "../../CommonUtilities";

const defaultHotkeys = [
    {name: "SAVE", hotkey: "Ctrl/Cmd + S", label: "Save transcript"},
    {name: "SPLIT", hotkey: "Ctrl/Cmd + Enter", label: "Split caption at cursor position at current time"},
    {name: "UNDO", hotkey: "Ctrl/Cmd + Z", label: "Undo last action"},
    {name: "REDO", hotkey: "Ctrl/Cmd + Shift + Z", label: "Redo last action"}
];

const initialState = {
    hotkeys: (getFromLS("hotkeys") ? getFromLS("hotkeys") as {name: string, hotkey: string, label: string}[] : defaultHotkeys),
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
            saveToLS("hotkeys", newHotkeys);

            return {
                ...state,
                hotkeys: newHotkeys
            };
        case "HOTKEY_RESET":
            return {
                ...state,
                hotkeys: defaultHotkeys
            };
        default:
            return state;
    }
}

export default HotkeyReducer;