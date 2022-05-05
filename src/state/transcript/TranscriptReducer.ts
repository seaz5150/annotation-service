import { v4 as uuidv4 } from "uuid";
import { SegmentColors } from "../../enums/SegmentColors";
import moment from "moment";

type PlayerAction = {
    type: string,
    segmentBefore?: any,
    segmentAfter?: any,
    additionalSegment?: any
};

const initialState = {
    fullTranscript: [] as any[],
    speakerTags: [] as any[],
    segmentTags: null,
    segments: [] as any[],
    segmentId: "",
    playerActionHistory: [] as PlayerAction[],
    playerActionHistoryIndex: -1,
    audioLength: 0,
    amountUpdated: 0,

    splitTime: undefined,
    splitPlayerSegmentId: "",
    splitEditorSegmentId: "",
    splitWordIndex: 0,
    splitWord: false,
    splitCompleted: false,

    // For split undo.
    segmentToSplit: {},
    segmentAfterSplit: {},
    addedSplitSegment: {},

    saveActionIndex: -1,
    transcriptLastSaveTime: null,
    autosaveEnabled: true,
    autosaveInterval: 120000
};

const RecordingTranscriptReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "TRANSCRIPT_INITIALIZE":
            var segments = action.payload.segments;
            var speakerTags = action.payload.speaker_tags;

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

            return {
                ...state,
                fullTranscript: action.payload,
                speakerTags: speakerTags,
                segmentTags: action.payload.segment_tags,
                segments: segments,
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
                            segment_tags: (action.payload.segmentTags ? action.payload.segmentTags : segment.segment_tags),
                            words: (action.payload.segmentWords ? action.payload.segmentWords : segment.words),
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
        case "TRANSCRIPT_INCREASE_AMOUNT_UPDATED":        
            return {
                ...state,
                type: "TRANSCRIPT_INCREASE_AMOUNT_UPDATED",
                amountUpdated: state.amountUpdated + 1
            };
        case "TRANSCRIPT_RESET_AMOUNT_UPDATED":        
            return {
                ...state,
                type: "TRANSCRIPT_RESET_AMOUNT_UPDATED",
                amountUpdated: 0
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
            if ((action.payload.actionType === "UPDATE" || action.payload.actionType === "REMOVE" 
               || action.payload.actionType === "MERGE" || action.payload.actionType === "SPLIT")) {
                if (action.payload.segmentBefore === undefined) {
                    segmentBefore = state.segments.find(segment => segment.id === action.payload.segmentAfter.id);
                }
                else {
                    segmentBefore = action.payload.segmentBefore;
                }
            }

            return {
                ...state,
                type: "TRANSCRIPT_PLAYER_ADD_ACTION",
                playerActionHistory: [...state.playerActionHistory, {type: action.payload.actionType, segmentBefore: segmentBefore, segmentAfter: action.payload.segmentAfter, additionalSegment: action.payload.additionalSegment}],
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
                        segmentToRevert.segment_tags = currentHistoryAction.segmentBefore.segment_tags;
                        segmentToRevert.speaker = currentHistoryAction.segmentBefore.speaker;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    break;
                case "MERGE":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.words = currentHistoryAction.segmentBefore.words;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    newSegments.push(currentHistoryAction.additionalSegment);
                    break;
                case "SPLIT":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.start = currentHistoryAction.segmentBefore.start;
                        segmentToRevert.end = currentHistoryAction.segmentBefore.end;
                        segmentToRevert.words = currentHistoryAction.segmentBefore.words;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    newSegments = newSegments.filter((segment: { id: any; }) => segment.id !== currentHistoryAction.additionalSegment.id);
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
                        segmentToRevert.segment_tags = currentHistoryAction.segmentAfter.segment_tags ? currentHistoryAction.segmentAfter.segment_tags : segmentToRevert.segment_tags;
                        segmentToRevert.speaker = currentHistoryAction.segmentAfter.speaker ? currentHistoryAction.segmentAfter.speaker : segmentToRevert.speaker;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    break;
                case "MERGE":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.words = currentHistoryAction.segmentAfter.words;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    newSegments = newSegments.filter((segment: { id: any; }) => segment.id !== currentHistoryAction.additionalSegment.id);
                    break;
                case "SPLIT":
                    var segmentToRevert = newSegments.find((segment: { id: any; }) => segment.id === currentHistoryAction.segmentAfter.id);
                    if (segmentToRevert) {
                        segmentToRevert.start = currentHistoryAction.segmentAfter.start;
                        segmentToRevert.end = currentHistoryAction.segmentAfter.end;
                        segmentToRevert.words = currentHistoryAction.segmentAfter.words;
                    }
                    else {
                        console.log("ERROR: Segment to undo update of was not found.")
                    }
                    newSegments.push(currentHistoryAction.additionalSegment);
                    break;
            }

            return {
                ...state,
                type: "TRANSCRIPT_PLAYER_REDO_ACTION",
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
        case "TRANSCRIPT_UPDATE_WORDS":
            return {
                ...state,
                type: "TRANSCRIPT_UPDATE_WORDS"
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
        case "TRANSCRIPT_SPLIT_SEGMENT":
            if (state.splitWord) {
                alert("Split failed: please place the cursor in between words.");
                return {...state, splitCompleted: false};
            }

            if (state.splitPlayerSegmentId !== state.splitEditorSegmentId) {
                alert("Split failed: please make sure you are in the correct segment on the waveform and your cursor is in the text of the same segment.");
                return {...state, splitCompleted: false};
            }

            if (state.splitTime === undefined || state.splitPlayerSegmentId === "") {
                alert("Split failed: please make sure you are in the correct segment on the waveform and your cursor is in the text of the same segment.");
                return {...state, splitCompleted: false};
            }

            var newSegments = JSON.parse(JSON.stringify(state.segments));
            var segmentToSplit = newSegments.find((s: any) => s.id === state.splitPlayerSegmentId);
            var segmentToSplitBackup = JSON.parse(JSON.stringify(segmentToSplit));

            if ((state.splitTime <= segmentToSplit.start) && (state.splitTime >= segmentToSplit.end)) {
                return {...state, splitCompleted: false};
            }

            var segmentToInsert = JSON.parse(JSON.stringify(segmentToSplit));
            segmentToSplit.words.splice(state.splitWordIndex, segmentToInsert.words.length);
            segmentToInsert.words.splice(0, state.splitWordIndex);

            segmentToSplit.end = state.splitTime;
            segmentToInsert.start = state.splitTime;
            segmentToInsert.id = uuidv4();

            newSegments.push(segmentToInsert);
            return {
                ...state,
                segments: newSegments,
                segmentToSplit: segmentToSplitBackup,
                segmentAfterSplit: segmentToSplit,
                addedSplitSegment: segmentToInsert,
                splitCompleted: true,
                type: "TRANSCRIPT_SPLIT_SEGMENT"
            };
        case "TRANSCRIPT_INPUT_PLAYER_SPLIT_INFO":
            if (action.payload.time === undefined || action.payload.segmentId === "") {
                return state;
            }
            return {
                ...state,
                splitTime: action.payload.time,
                splitPlayerSegmentId: action.payload.segmentId,
                type: "TRANSCRIPT_INPUT_PLAYER_SPLIT_INFO"
            };
        case "TRANSCRIPT_INPUT_EDITOR_SPLIT_INFO":
            return {
                ...state,
                splitEditorSegmentId: action.payload.segmentId,
                splitWordIndex: action.payload.wordIndex,
                splitWord: action.payload.splitWord,
                type: "TRANSCRIPT_INPUT_PLAYER_SPLIT_INFO"
            };
        case "TRANSCRIPT_GATHER_SPLIT_INFO":
            return {
                ...state,
                type: "TRANSCRIPT_GATHER_SPLIT_INFO"
            };
        case "TRANSCRIPT_CONSTRUCT_FULL_TRANSCRIPT":
            var constructedTranscript = JSON.parse(JSON.stringify(state.fullTranscript));
            constructedTranscript.segments = JSON.parse(JSON.stringify(state.segments));
            constructedTranscript.segments.map((s: { id: any; }) => delete s.id);
            constructedTranscript.speaker_tags = JSON.parse(JSON.stringify(state.speakerTags));
            constructedTranscript.speaker_tags.map((st: { color: any; }) => delete st.color);

            return {
                ...state,
                fullTranscript: constructedTranscript,
                type: "TRANSCRIPT_CONSTRUCT_FULL_TRANSCRIPT"
            };
        case "TRANSCRIPT_SET_SAVE_ACTION_INDEX":
            return {
                ...state,
                saveActionIndex: action.payload,
                type: "TRANSCRIPT_SET_SAVE_ACTION_INDEX"
            };
        case "TRANSCRIPT_SAVE_CHANGES":
            let currentTime = moment();
            return {
                ...state,
                transcriptLastSaveTime: currentTime,
                type: "TRANSCRIPT_SAVE_CHANGES"
            };
            case "TRANSCRIPT_TOGGLE_AUTOSAVE":
            return {
                ...state,
                autosaveEnabled: action.payload,
                type: "TRANSCRIPT_TOGGLE_AUTOSAVE"
            };
            case "TRANSCRIPT_SET_AUTOSAVE_INTERVAL":
            return {
                ...state,
                autosaveInterval: action.payload,
                type: "TRANSCRIPT_SET_AUTOSAVE_INTERVAL"
            };
        default:
            return state;
    }
}

export default RecordingTranscriptReducer;