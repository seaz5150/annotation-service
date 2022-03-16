interface SettingsWindowInterface {
    settingsExpanded: boolean
}

const SettingsWindow = (props: SettingsWindowInterface) => {
    return (  
        <div className={"settings-window ms-auto me-auto" + (props.settingsExpanded ? " settings-window-expand" : "")}>
            <div className="card-header d-flex justify-content-between">
                Settings
            </div>
            
        </div>
    );
}
 
export default SettingsWindow;
