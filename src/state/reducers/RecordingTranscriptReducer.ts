import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { actionCreators } from "..";
import { SegmentColors } from "../../enums/SegmentColors"
import { TagColors } from "../../enums/TagColors";

type PlayerAction = {
    type: string,
    segmentBefore?: any,
    segmentAfter?: any
};

const initialState = {
    speakerTags: [] as any[],
    segmentTags: null,
    textTags: null,
    unpairedTags: null,
    segments: [] as any[],
    segmentId: "",
    playerActionHistory: [] as PlayerAction[],
    playerActionHistoryIndex: -1,
    audioLength: 0
};

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "TRANSCRIPT_INITIALIZE":
            var segments = action.payload.segments;
            var speakerTags = action.payload.speakerTags;
            var textTags = action.payload.textTags;

            action.payload.unpairedTags = [
                {"label": "Unknown", "id": "unknown"},
                {"label": "Hesitation", "id": "hesitation"},
                {"label": "Noise", "id": "noise"},
                {"label": "Speaker noise", "id": "speakernoise"},
                {"label": "Double-press PTT", "id": "doublepress"},
                {"label": "Crosstalk", "id": "crosstalk"}
            ];

            var unpairedTags = action.payload.unpairedTags;

            for (let segment in segments) {
                let segmentObj = segments[segment];
                // Add unique IDs to the segments before saving them to the store.
                segmentObj.id = uuidv4();

                // Some speaker labels may not be specified and used in the segments anyway, so add those.
                if (!speakerTags.find((tag: { id: any; }) => tag.id === segmentObj.speaker)) {
                    speakerTags.push({
                        id: segmentObj.speaker,
                        label: ""
                    })
                }
            }
            
            let colorCounter = 0;
            for (let i in speakerTags) {
                let speakerTag = speakerTags[i];
                speakerTag.color = SegmentColors[Object.keys(SegmentColors)[colorCounter]];

                if (colorCounter >= speakerTags.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }
            
            colorCounter = 0;
            for (let i in textTags) {
                let textTag = textTags[i];
                textTag.color = TagColors[Object.keys(TagColors)[colorCounter]];

                if (colorCounter >= speakerTags.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }

            colorCounter = speakerTags.length - 1;
            for (let i in unpairedTags) {
                let unpairedTag = unpairedTags[i];
                unpairedTag.color = TagColors[Object.keys(TagColors)[colorCounter]];

                if (colorCounter >= unpairedTag.length - 1) {
                    colorCounter = 0;
                }
                else {
                    colorCounter++;
                }
            }

            return {
                ...state,
                speakerTags: speakerTags,
                segmentTags: action.payload.segmentTags,
                textTags: textTags,
                segments: segments,
                unpairedTags: unpairedTags,
                type: "TRANSCRIPT_INITIALIZE"
            };
        case "TRANSCRIPT_SEGMENT_UPDATE":
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_UPDATE",
                segments: state.segments.map(
                    segment => segment.id === action.payload.segmentId ?
                        {...segment, 
                            start: (action.payload.segmentStart ? action.payload.segmentStart : segment.start),
                            end: (action.payload.segmentEnd ? action.payload.segmentEnd : segment.end),
                            speaker: ((action.payload.segmentSpeakerId || action.payload.segmentSpeakerId === "") ? action.payload.segmentSpeakerId : segment.speaker),
                            segmentTags: (action.payload.segmentTags ? action.payload.segmentTags : segment.segmentTags)
                        }
                    : segment
                )
            };
        case "TRANSCRIPT_SEGMENT_DELETE":        
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_DELETE",
                segments: state.segments.filter((segment) => segment.id !== action.payload),
                segmentId: action.payload
            };
        case "TRANSCRIPT_SEGMENT_CREATE":
            return {
                ...state,
                type: "TRANSCRIPT_SEGMENT_CREATE",
                segments: [...state.segments, {
                    start: action.payload.segmentStart,
                    end: action.payload.segmentEnd,
                    id: action.payload.segmentId,
                    speaker: "",
                    words: []
                }]
            };
        case "TRANSCRIPT_SPEAKER_CREATE":
            return {
                ...state,
                type: "TRANSCRIPT_SPEAKER_CREATE",
                speakerTags: [ ...state.speakerTags, {id: action.payload.speakerId, label: action.payload.speakerLabel, color: SegmentColors[Object.keys(SegmentColors)[state.speakerTags.length]]}]
            };
        case "TRANSCRIPT_SPEAKER_UPDATE":
            return {
                ...state,
                type: "TRANSCRIPT_SPEAKER_UPDATE",
                speakerTags: state.speakerTags.map(
                    tag => tag.id === action.payload.speakerId ?
                        {...tag, 
                            label: action.payload.speakerLabel
                        }
                    : tag
                )
            };
        case "TRANSCRIPT_PLAYER_ADD_ACTION":
            var segmentBefore: any;
            if (action.payload.actionType === "UPDATE" || action.payload.actionType === "REMOVE") {
                segmentBefore = state.segments.find(segment => segment.id === action.payload.segmentAfter.id);
            }

            return {
                ...state,
                type: "TRANSCRIPT_PLAYER_ADD_ACTION",
                playerActionHistory: [...state.playerActionHistory, {type: action.payload.actionType, segmentBefore: segmentBefore, segmentAfter: action.payload.segmentAfter}],
                playerActionHistoryIndex: state.playerActionHistoryIndex + 1
            };
        case "TRANSCRIPT_PLAYER_UNDO_ACTION":
            if (state.playerActionHistoryIndex === -1) return state;
            var currentHistoryAction = state.playerActionHistory[state.playerActionHistoryIndex];

            var newSegments = JSON.parse(JSON.stringify(state.segments));
            switch (currentHistoryAction.type) {
                case "CREATE":
                    newSegments = newSegments.filter((segment: { id: any; }) => segment.id !== currentHistoryAction.segmentAfter.id);
                    break;
                case "REMOVE":
                    newSegments.push(currentHistoryAction.segmentBefore);
                    break;
                case "UPDATE":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.start = currentHistoryAction.segmentBefore.start;
                        segmentToRevert.end = currentHistoryAction.segmentBefore.end;
                        segmentToRevert.segmentTags = currentHistoryAction.segmentBefore.segmentTags;
                        segmentToRevert.speaker = currentHistoryAction.segmentBefore.speaker;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    break;
            }

            return {
                ...state,
                type: "TRANSCRIPT_PLAYER_UNDO_ACTION",
                playerActionHistoryIndex: state.playerActionHistoryIndex - 1,
                segments: newSegments
            };
        case "TRANSCRIPT_PLAYER_REDO_ACTION":
            if (state.playerActionHistoryIndex === state.playerActionHistory.length - 1) return state;
            var currentHistoryAction = state.playerActionHistory[state.playerActionHistoryIndex + 1];

            var newSegments = JSON.parse(JSON.stringify(state.segments));
            switch (currentHistoryAction.type) {
                case "CREATE":
                    newSegments.push({id: currentHistoryAction.segmentAfter.id, 
                                        start: currentHistoryAction.segmentAfter.start, 
                                        end: currentHistoryAction.segmentAfter.end,
                                        words: [], 
                                        speaker: ""});
                    break;
                case "REMOVE":
                    newSegments = newSegments.filter((segment: { id: any; }) => segment.id !== currentHistoryAction.segmentAfter.id);
                    break;
                case "UPDATE":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.start = currentHistoryAction.segmentAfter.start ? currentHistoryAction.segmentAfter.start : segmentToRevert.start;
                        segmentToRevert.end = currentHistoryAction.segmentAfter.end ? currentHistoryAction.segmentAfter.end : segmentToRevert.end;
                        segmentToRevert.segmentTags = currentHistoryAction.segmentAfter.segmentTags ? currentHistoryAction.segmentAfter.segmentTags : segmentToRevert.segmentTags;
                        segmentToRevert.speaker = currentHistoryAction.segmentAfter.speaker ? currentHistoryAction.segmentAfter.speaker : segmentToRevert.speaker;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    break;
            }

            return {
                ...state,
                type: "TRANSCRIPT_PLAYER_UNDO_ACTION",
                playerActionHistoryIndex: state.playerActionHistoryIndex + 1,
                segments: newSegments
            };
        case "TRANSCRIPT_SEGMENTS_SHIFT":
            var newSegments = JSON.parse(JSON.stringify(state.segments));
            for (let i in newSegments) {
                let currentSegment = newSegments[i];
                let newStart = Number(currentSegment.start) + action.payload;
                let newEnd = Number(currentSegment.end) + action.payload;
                if (newStart < 0) {
                    return state;
                }
                if (newEnd > state.audioLength) {
                    return state;
                }

                currentSegment.start = newStart;
                currentSegment.end = newEnd;
            }

            console.log(newSegments);

            return {
                ...state,
                type: "TRANSCRIPT_SEGMENTS_SHIFT",
                segments: newSegments
            };
        case "TRANSCRIPT_INITIALIZE_LENGTH":
            return {
                ...state,
                type: "TRANSCRIPT_INITIALIZE_LENGTH",
                audioLength: action.payload
            };
        case "TRANSCRIPT_MERGE_SEGMENTS":
            var newSegments = JSON.parse(JSON.stringify(state.segments));
            newSegments.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

            var mergeTargetSegment = newSegments.find((s: any) => s.id === action.payload);
            var mergeTargetSegmentIndex = newSegments.findIndex((s: { id: any; }) => s.id === action.payload);
            var mergeSourceSegment = newSegments[mergeTargetSegmentIndex + 1];

            mergeTargetSegment.end = mergeSourceSegment.end;
            newSegments = newSegments.filter((s: { id: any; }) => s.id !== mergeSourceSegment.id);

            return {
                ...state,
                type: "TRANSCRIPT_MERGE_SEGMENTS",
                segments: newSegments
            };
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;