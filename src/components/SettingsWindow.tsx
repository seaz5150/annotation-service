interface SettingsWindowInterface {
    settingsExpanded: boolean
}

const SettingsWindow = (props: SettingsWindowInterface) => {
    return (  
        <div className={"settings-window ms-auto me-auto" + (props.settingsExpanded ? " settings-window-expand" : "")}>
            <div className="card-header d-flex justify-content-between">
                Settings
            </div>
            <div className="row mt-1 ms-4 me-4">
                <div className="settings-column col">
                    <p className="title-small">Shortcuts</p>
                </div>
                <div className="settings-column col">
                    <p className="title-small">Layout</p>
                </div>
                <div className="settings-column col">
                    <p className="title-small">Misc</p>
                </div>
            </div>
        </div>
    );
}
 
export default SettingsWindow;
