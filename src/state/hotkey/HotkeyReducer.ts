import { getFromLS, saveToLS } from "../../utils/CommonUtilities";

const defaultHotkeys = [
    {name: "SAVE", hotkey: "Ctrl/Cmd + S", label: "Save transcript"},
    {name: "SPLIT", hotkey: "Ctrl/Cmd + Enter", label: "Split caption at cursor position at current time"},
    {name: "UNDO", hotkey: "Ctrl/Cmd + Z", label: "Undo last action"},
    {name: "REDO", hotkey: "Ctrl/Cmd + Shift + Z", label: "Redo last action"},
    {name: "TOGGLE_PLAY", hotkey: "Ctrl/Cmd + Space", label: "Play/pause"}
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
            var newHotkeys = JSON.parse(JSON.stringify(state.hotkeys));
            var foundHotkey = newHotkeys.find((h: { name: any; }) => h.name === action.payload.name);
            foundHotkey.hotkey = action.payload.hotkey;
            saveToLS("hotkeys", newHotkeys);

            return {
                ...state,
                hotkeys: newHotkeys
            };
        case "HOTKEY_RESET":
            saveToLS("hotkeys", defaultHotkeys);
            return {
                ...state,
                hotkeys: defaultHotkeys
            };
        case "HOTKEY_ADD_TEXT_TAGS":
            var newHotkeys = JSON.parse(JSON.stringify(state.hotkeys));
            action.payload.textTags.forEach((t: { id: string; label: string }, index: number) => {
                var indexPp = index + 1;
                if (indexPp <= 12) {
                    newHotkeys.push({name: t.label, hotkey: "Shift + F" + indexPp, label: "Tag selection as \"" + t.label.toLowerCase() + "\"", tagHotkey: true, unpairedTag: false});
                }
            })
            action.payload.unpairedTags.forEach((t: { id: string; label: string }, index: number) => {
                var indexPpTotal = action.payload.textTags.length + index + 1;
                if (indexPpTotal <= 12) {
                    newHotkeys.push({name: t.id, hotkey: "Shift + F" + indexPpTotal, label: "Insert \"" + t.label.toLowerCase() + "\" tag at cursor", tagHotkey: true, unpairedTag: true});
                }
            })
            return {
                ...state,
                hotkeys: newHotkeys
            };
        default:
            return state;
    }
}

export default HotkeyReducer;