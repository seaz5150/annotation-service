import moment from "moment";
import { TagColors } from "../../enums/TagColors";

const initialState = {
    jobId: "7Nm4rHgnMvIKAxqT",
    jobData: null,
    textTags: null,
    unpairedTags: null,
    jobLastSaveTime: null,
    autosaveEnabled: true,
    autosaveInterval: 120000,
    saveActionIndex: -1
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
            textTag.color = TagColors[Object.keys(TagColors)[colorCounter]];

            if (colorCounter >= textTags.length - 1) {
                colorCounter = 0;
            }
            else {
                colorCounter++;
            }
        }

        colorCounter = textTags.length - 1;
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
            jobData: action.payload,
            unpairedTags: unpairedTags, 
            textTags: textTags,
            type: "JOB_INITIALIZE"
        };
    case "JOB_SAVE_CHANGES":
      let currentTime = moment();
      return {
          ...state,
          jobLastSaveTime: currentTime,
          type: "JOB_SAVE_CHANGES"
      };
    case "JOB_TOGGLE_AUTOSAVE":
      return {
          ...state,
          autosaveEnabled: action.payload,
          type: "JOB_TOGGLE_AUTOSAVE"
      };
    case "JOB_SET_AUTOSAVE_INTERVAL":
      return {
          ...state,
          autosaveInterval: action.payload,
          type: "JOB_SET_AUTOSAVE_INTERVAL"
      };
    case "JOB_SET_SAVE_ACTION_INDEX":
      return {
          ...state,
          saveActionIndex: action.payload,
          type: "JOB_SET_SAVE_ACTION_INDEX"
      };
    default:
        return state;
  }
}

export default JobReducer;