// Toggles module on/off depending on given value.
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