import React, {
  useEffect,
  useRef} from "react";
import AnnotationTextSegment from './AnnotationTextSegment';
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/Index";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from 'react-sizeme'

interface AnnotationTextInterface {
    updateElementGridSize: any,
    size: any
}

function AnnotationTextSegmentContainer(props: AnnotationTextInterface) {
    const dispatch = useDispatch();
    const { createActionSegmentReferencesInitialize } = bindActionCreators(actionCreators, dispatch);

    const segments = useSelector((state: any) => state.recordingTranscript.segments);
    segments.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

    const segmentRefs = useRef([] as any[]); 
    segmentRefs.current = [];
    const { width, height } = props.size;

    const updateElementGridSize = props.updateElementGridSize;

    useEffect(() => {
        updateElementGridSize("AnnotationTextSegmentContainer", height);
    }, [height]);

    const addToSegmentRefs = (segmentEl: any, segmentId: any) => {
        if (segmentEl && !segmentRefs.current.includes(segmentEl)) {
            segmentRefs.current.push({
                id: segmentId,
                ref: segmentEl
            });
            createActionSegmentReferencesInitialize(segmentRefs.current);
        }
    }

    return (
    <div className="segments">
        {segments &&
            <React.Fragment>
                {(segments.length > 0) ?
                    segments.map((segment: any) => 
                        <AnnotationTextSegment segmentId={segment.id} key={segment.id} segmentRef={(el: any) => addToSegmentRefs(el, segment.id)} parentWidth={width} />
                    )
                    :
                    <div className="module module-content segment segment-placeholder">
                        <i className="bi bi-info-circle me-2 info-icon"></i>
                        Create a caption by dragging on the waveform.
                    </div>
                }
            </React.Fragment>
        }
    </div>
    );
}

export default sizeMe({ monitorHeight: true })(AnnotationTextSegmentContainer)