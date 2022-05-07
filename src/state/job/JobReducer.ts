import { TextLabelColors } from "../../enums/TextLabelColors";

const initialState = {
    jobId: "", // cJoQKr9yWZw5bOtJ
    jobData: null,
    textTags: null,
    unpairedTags: null
};

const JobReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "JOB_INITIALIZE":
        var textTags = action.payload.user_interface.text_tags;
        var unpairedTags = [
          {"label": "Unknown", "id": "[unk]"},
          {"label": "Hesitation", "id": "[hes]"},
          {"label": "Noise", "id": "[noise]"},
          {"label": "Speaker noise", "id": "[spk]"},
          {"label": "Double-press PTT", "id": "[key]"},
          {"label": "Crosstalk", "id": "[XT]"}
        ] as any;

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
        for (let i in unpairedTags) {
            let unpairedTag = unpairedTags[i];
            unpairedTag.color = TextLabelColors[Object.keys(TextLabelColors)[colorCounter]];

            if (colorCounter >= unpairedTag.length - 1) {
                colorCounter = 0;
            }
            else {
                colorCounter++;
            }
        }

        return {
            ...state,
            jobId: action.payload.id,
            jobData: action.payload,
            unpairedTags: unpairedTags, 
            textTags: textTags,
            type: "JOB_INITIALIZE"
        };
    default:
        return state;
  }
}

export default JobReducer;