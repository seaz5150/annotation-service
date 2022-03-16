const initialState = {
    moduleName: "",
    modules: [] as string[],
    openModules: [] as string[]
};

const DashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "DASHBOARD_INITIALIZE_MODULE_LIST":
            return {
                modules: action.payload,
                type: "DASHBOARD_INITIALIZE_MODULE_LIST"
            };
        case "DASHBOARD_CLOSE_MODULE":
            return {
                moduleName: action.payload,
                type: "DASHBOARD_CLOSE_MODULE"
            };
        case "DASHBOARD_OPEN_MODULE":
            return {
                moduleName: action.payload,
                type: "DASHBOARD_OPEN_MODULE"
            };
        default:
            return state;
    }
}

export default DashboardReducer;