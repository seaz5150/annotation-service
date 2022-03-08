import { useEffect, useRef } from "react";
import sizeMe from "react-sizeme";

interface ChangesInterface {
    updateElementGridSize: any,
    size: any
}

const Changes = (props: ChangesInterface) => {
    const { width, height } = props.size;

    useEffect(() => {
        props.updateElementGridSize("Changes", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header">
                Changes
            </div>
            <div className="module-content card-body mt-1 pb-2">
                <div className="d-flex justify-content-between">
                    <div>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button">
                            <i className="bi bi-arrow-counterclockwise undo-redo-button-icon"></i>
                        </button>
                        <button className="text-tag-button btn-secondary custom-dropdown undo-redo-button">
                            <i className="bi bi-arrow-clockwise undo-redo-button-icon"></i>
                        </button>
                    </div>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end">
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-download me-2 export-button-icon"></i>
                            Export
                        </div>
                    </button>
                    <button className="text-tag-button btn-secondary custom-dropdown save-button justify-self-end">
                        <div className="d-flex align-items-center justify-content-center">
                            <i className="fas fa-save me-2 save-button-icon"></i>
                            Save
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(Changes)
