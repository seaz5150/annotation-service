import { TextLabelColors } from "../../enums/TextLabelColors";

const initialState = {
    jobId: "", // cJoQKr9yWZw5bOtJ
    jobData: null,
    textTags: null,
    unpairedTags: [
        {"label": "Unknown", "id": "[unk]"},
        {"label": "Hesitation", "id": "[hes]"},
        {"label": "Noise", "id": "[noise]"},
        {"label": "Speaker noise", "id": "[spk]"},
        {"label": "Double-press PTT", "id": "[key]"},
        {"label": "Crosstalk", "id": "[XT]"}
      ] as any,
    jobList: [] as any[],
    currentJobIndex: null,
    canJumpNext: false,
    canJumpPrevious: false
};

const JobReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "JOB_INITIALIZE":
        var textTags = action.payload.user_interface.text_tags;

        let colorCounter = 0;
        for (let i in textTags) {
            let textTag = textTags[i];
            textTag.color = TextLabelColors[Object.keys(TextLabelColors)[colorCounter]];

            if (colorCounter >= textTags.length - 1) {
                colorCounter = 0;
            }
            else {
                colorCounter++;
            }
        }

        colorCounter = textTags.length;
        for (let i in state.unpairedTags) {
            let unpairedTag = state.unpairedTags[i];
            unpairedTag.color = TextLabelColors[Object.keys(TextLabelColors)[colorCounter]];

            if (colorCounter >= unpairedTag.length - 1) {
                colorCounter = 0;
            }
            else {
                colorCounter++;
            }
        }

        var newJobIndex = state.jobList.findIndex((j: { id: any; }) => j.id === action.payload.id);
        var newCanJumpNext = newJobIndex !== state.jobList.length - 1;
        var newCanJumpPrevious = newJobIndex !== 0;

        return {
            ...state,
            jobId: action.payload.id,
            jobData: action.payload,
            unpairedTags: state.unpairedTags, 
            textTags: textTags,
            currentJobIndex: newJobIndex,
            canJumpNext: newCanJumpNext,
            canJumpPrevious: newCanJumpPrevious,
            type: "JOB_INITIALIZE"
        };
    case "JOB_LIST_INITIALIZE":
        // Remove non-ATCO2 jobs from the list.
        var newJobList = action.payload.filter((j: { pipeline: { id: string; }; }) => j.pipeline?.id === "ATCO2");
        return {
            ...state,
            jobList: newJobList,
            type: "JOB_LIST_INITIALIZE"
        };
    case "JOB_NEXT":
        var newJobIndex: number = (state.currentJobIndex as any) + 1;
        var newJob = state.jobList.at(newJobIndex);

        return {
            ...state,
            jobId: newJob.id,
            type: "JOB_NEXT"
        };
    case "JOB_PREVIOUS":
        var newJobIndex: number = (state.currentJobIndex as any) - 1;
        var newJob = state.jobList.at(newJobIndex);

        return {
            ...state,
            jobId: newJob.id,
            type: "JOB_PREVIOUS"
        };
    default:
        return state;
  }
}

export default JobReducer;