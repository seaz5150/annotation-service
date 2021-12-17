import Button from "react-bootstrap/Button";

const Settings = () => {

    const handlePress = (e) => {
        e.stopPropagation();
    }
    
    return (  
        <div className="card module module-settings">
            <div class="card-header">
                Settings
            </div>
            <div className="module-content card-body">
                <Button onMouseDown={e => handlePress(e)}>Button</Button>
            </div>
        </div>
    );
}
 
export default Settings;
