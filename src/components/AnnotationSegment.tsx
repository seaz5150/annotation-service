import { getFormattedTime } from "../TimeUtils";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface AnnotationSegmentInterface {
    segmentId: string
}

const AnnotationSegment = (props: AnnotationSegmentInterface) => {
    const dispatch = useDispatch();
    const { createActionAudioPlaySegment } = bindActionCreators(actionCreators, dispatch);

    const segment = useSelector((state: any) => state.recordingTranscript.segments.filter((segment: { id: string; }) => segment.id === props.segmentId));

    const handlePress = (e: any) => {
        e.stopPropagation();
    }

    return (
        <div className="card card-body module module-content p-0 segment">
                 {segment &&
                     <div className="card card-body module module-content p-0 segment">
                     <div className="p-0 segment-play-panel">
                         <div className="segment-play-panel-content">
                             <button className="icon-button segment-play-button"
                                     onMouseDown={e => handlePress(e)}
                                     onClick={() => createActionAudioPlaySegment(segment[0].id)}
                             >
                                 <i className="bi bi-play-fill"></i>
                             </button>
                             <div className="segment-times ps-1"
                                     onMouseDown={e => handlePress(e)}
                             >
                                 <p className="segment-time-start">{getFormattedTime(Number(segment[0].start))}</p>
                                 <p className="segment-time-end">{getFormattedTime(Number(segment[0].end))}</p>
                             </div>
                         </div>
                     </div>
                     <div className="segment-text-panel">
                         <p className="segment-text"
                             contentEditable="true"
                             onMouseDown={e => handlePress(e)}
                         >
                             Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus et lorem id felis nonummy placerat. Integer lacinia. Praesent in mauris eu tortor porttitor accumsan.
                         </p>
                         <div className="segment-tag-bar">
                             <select className="form-select form-select-sm custom-dropdown speaker-select"
                                     onMouseDown={e => handlePress(e)}
                             >
                                 <option selected>Speaker</option>
                                 <option value="1">One</option>
                                 <option value="2">Two</option>
                                 <option value="3">Three</option>
                             </select>
                             <div className="dropdown">
                                 <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown"
                                         onMouseDown={e => handlePress(e)}
                                         type="button" id="dropdownMenuButton1"
                                         data-bs-toggle="dropdown"
                                         aria-expanded="false"
                                 >
                                     Segment labels
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
             
                             <button className="icon-button segment-delete-button"
                                     onMouseDown={e => handlePress(e)}
                             >
                                 <i className="bi bi-x"></i>
                             </button>
                         </div>
                     </div>
                    </div>
                 }   
        </div>
    );
}

export default AnnotationSegment;