import { useEffect, useRef } from "react";
import sizeMe from "react-sizeme";

interface RecordingDetailsInterface {
    updateElementGridSize: any,
    size: any
}

const RecordingDetails = (props: RecordingDetailsInterface) => {
    const { width, height } = props.size;

    const handlePress = (e: any) => {
        e.stopPropagation();
    }

    useEffect(() => {
        props.updateElementGridSize("RecordingDetails", height);
    }, [height]);
    
    return (  
        <div className="module module-settings">
            <div className="card-header">
                Recording details
            </div>
            <div className="module-content card-body mt-1 pb-2">
                <div className="row">
                    <p className="title-small col-3">Name:</p>
                    <p className="text-small col-9">YSSY Tower 2021-06-02 22:13:43</p>
                </div>
                <p className="title-small col-12 mb-1">Description:</p>
                <textarea className="form-control form-control-sm custom-textarea" onMouseDown={e => handlePress(e)} readOnly defaultValue="Integer lacinia. Maecenas aliquet accumsan leo. Aliquam ante. Aenean fermentum risus id tortor. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Nunc tincidunt ante vitae massa. Vivamus ac leo pretium faucibus."/>
                <p className="title-small col-12 mb-1 mt-2">Display attached resources:</p>
                <div className="row align-items-center">
                    <p className="title-small col-10 ms-2">Traffic map</p>
                    <input className="form-check-input custom-checkbox col-2 ms-auto me-3" type="checkbox" value="" onMouseDown={e => handlePress(e)} />
                </div>
                <div className="row mt-3 align-items-center">
                    <p className="title-small col-7">Manuals and others:</p>
                    <div className="dropdown col-5">
                        <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown"
                                onMouseDown={e => handlePress(e)}
                                type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                        >
                            Attached links
                        </button>
                        <ul className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton1" 
                            onMouseDown={e => handlePress(e)}
                        >
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default sizeMe({ monitorHeight: true })(RecordingDetails)
