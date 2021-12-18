import { MouseEvent } from "react";

const Settings = () => {

    const handlePress = (e: any) => {
        e.stopPropagation();
    }
    
    return (  
        <div className="card module module-settings">
            <div className="card-header">
                Settings
            </div>
            <div className="module-content card-body">
                <button className="btn btn-primary" onMouseDown={e => handlePress(e)}>Button</button>
            </div>
        </div>
    );
}
 
export default Settings;
