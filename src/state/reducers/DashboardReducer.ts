const initialState = {
    moduleName: ""
};

const DashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
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