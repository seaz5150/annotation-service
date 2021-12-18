import { MouseEvent } from "react";

const RecordingDetails = () => {

    const handlePress = (e: any) => {
        e.stopPropagation();
    }
    
    return (  
        <div className="card module module-settings">
            <div className="card-header">
                Recording details
            </div>
            <div className="module-content card-body mt-1">
                <div className="row">
                    <p className="title-small col-3">Name:</p>
                    <p className="text-small col-9">YSSY Tower 2021-06-02 22:13:43</p>
                </div>
                <p className="title-small col-3 mb-1">Description:</p>
                <textarea className="form-control form-control-sm"></textarea>
            </div>
        </div>
    );
}
 
export default RecordingDetails;
