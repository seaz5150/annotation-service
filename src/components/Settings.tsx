import { MouseEvent } from "react";

const Settings = () => {

    const handlePress = (e: any) => {
        e.stopPropagation();
    }
    
    const printSelection = () => {
        console.log(window.getSelection()?.getRangeAt(0).cloneContents());
    }

    return (  
        <div className="card module module-settings">
            <div className="card-header">
                Settings
            </div>
            <div className="module-content card-body">
                <button className="btn btn-primary" onClick={printSelection} onMouseDown={e => handlePress(e)}>Button</button>
            </div>
        </div>
    );
}
 
export default Settings;
