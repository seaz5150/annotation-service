const initialState = {
    moduleName: "",
    value: false,
    allModules: [] as {name: string, viewName?: string}[],
    openModules: [] as string[]
};

const DashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "DASHBOARD_INITIALIZE_MODULES":
            let moduleList = [] as {name: string, viewName?: string}[];
            let modules = action.payload;
            for (let i in modules) {
                let currentModule = modules[i];
                let currentModuleListItem: {name: string, viewName?: string} = {name: currentModule};
                switch (currentModule) {
                    case "TextTags":
                        currentModuleListItem.viewName = "Text labels";
                        break;
                    case "RecordingDetails":
                        currentModuleListItem.viewName = "Job details";
                        break;
                    case "Changes":
                        currentModuleListItem.viewName = "Changes";
                        break;   
                    case "JobControl":
                        currentModuleListItem.viewName = "Job control";
                        break;   
                    case "SpeakerLabels":
                        currentModuleListItem.viewName = "Speaker labels";
                        break;
                }
                moduleList.push(currentModuleListItem);
            }
            return {
                ...state,
                allModules: moduleList,
                type: "DASHBOARD_INITIALIZE_MODULES"
            };
        case "DASHBOARD_INITIALIZE_OPEN_MODULES":
            return {
                ...state,
                openModules: action.payload,
                type: "DASHBOARD_INITIALIZE_OPEN_MODULES"
            };
        case "DASHBOARD_TOGGLE_MODULE":
            return {
                ...state,
                moduleName: action.payload.moduleName,
                value: action.payload.value,
                type: "DASHBOARD_TOGGLE_MODULE"
            };
        case "DASHBOARD_TOGGLE_MODULE_STATIC":
            return {
                ...state,
                moduleName: action.payload.moduleName,
                value: action.payload.value,
                type: "DASHBOARD_TOGGLE_MODULE_STATIC"
            };
        case "DASHBOARD_RESET_LAYOUT":
            return {
                ...state,
                type: "DASHBOARD_RESET_LAYOUT"
            };
        default:
            return state;
    }
}

export default DashboardReducer;