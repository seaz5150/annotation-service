import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import AnnotationSegment from './AnnotationSegment';
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { useDispatch, useSelector } from "react-redux";
import sizeMe from 'react-sizeme'
import { recordingJson } from "../CommonUtilities";

interface AnnotationTextInterface {
    updateElementGridSize: any,
    size: any
}

function AnnotationText(props: AnnotationTextInterface) {
    const dispatch = useDispatch();
    const { createActionTranscriptInitialize,
            createActionSegmentReferencesInitialize,
            createActionJobInitialize
          } = bindActionCreators(actionCreators, dispatch);

    const segments = useSelector((state: any) => state.recordingTranscript.segments);
    segments.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

    const segmentRefs = useRef([] as any[]); 
    segmentRefs.current = [];
    const { width, height } = props.size;

    const updateElementGridSize = props.updateElementGridSize;

    useEffect(() => {
        updateElementGridSize("AnnotationText", height);
    }, [height]);

    useEffect(() => {
        createActionTranscriptInitialize(recordingJson.transcript);
    }, []);

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
                        <AnnotationSegment segmentId={segment.id} key={segment.id} segmentRef={(el: any) => addToSegmentRefs(el, segment.id)}/>
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

export default sizeMe({ monitorHeight: true })(AnnotationText)