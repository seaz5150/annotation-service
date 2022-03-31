import moment from "moment";

const jobData = {
  "id": "gp3ojpewWR74SFs4",
  "title": "Job 1",
  "description": "This is the description of the job.",
  "category": "My category",
  "status": "done",
  "status_message": "job_successfully_finished",
  "duration": 37.5,
  "recorded_at": "2021-01-31T12:59:41Z",
  "created_at": "2021-03-12T01:10:41Z",
  "processed_at": "2021-03-12T01:15:10Z",
  "updated_at": "2021-03-15T20:12:41Z",
  "accessed_at": "2021-03-15T20:12:41Z",
  "url": {
    "mp3": "https://master.engine.spokendata.com/storage/2022/02/10/152444-501-jxafs/audio.mp3",
    "thumbnail": "https://master.engine.spokendata.com/storage/2022/02/10/152444-501-jxafs/thumbnail.png",
    "transcript": "https://master.engine.spokendata.com/storage/2022/02/10/152444-501-jxafs/output.json",
    "waveform": "https://master.engine.spokendata.com/storage/2022/02/10/152444-501-jxafs/waveform.wf",
    "waveform_thumbnail": "https://master.engine.spokendata.com/storage/2022/02/10/152444-501-jxafs/waveform.png"
  },
  "pipeline": {
    "id": "ATCO2",
    "tasks": [
      {
        "id": "SNR",
        "output": {
          "snr": 12.3
        }
      },
      {
        "id": "VAD",
        "output": {
          "speech": 11.4,
          "transcript_id": "da8730a-4645-hcbe35a69-a356-8715"
        }
      },
      {
        "id": "ASR",
        "output": {
          "language": "english",
          "confidence": 0.71,
          "transcript_id": "da8730a-4645-hcbe35a69-a356-08ac"
        }
      },
      {
        "id": "Human-1234",
        "output": {
          "assigned_at": "2021-03-17T12:59:41Z",
          "timeSpent": 467.4,
          "transcript_id": "da8730a-4645-hcbe35a69-a356-301f"
        }
      },
      {
        "id": "Human-4531",
        "output": {
          "assigned_at": "2021-03-18T10:40:25Z",
          "time_spent": 167.4,
          "transcript_id": "da8730a-4645-hcbe35a69-a356-a7e4"
        }
      },
      {
        "id": "callback",
        "settings": {
          "if_done": "https://www.domain.com/?status=done&jobId=$JOBID",
          "if_error": "https://www.domain.com/?status=error&jobId=$JOBID",
          "if_annotated": "https://www.domain.com/?status=annotated&jobId=$JOBID"
        }
      }
    ]
  },
  "user_interface": {
    "document_tags": [
      {
        "id": "A,",
        "label": "Checked final"
      },
      {
        "id": "D",
        "label": "Checked by Igor"
      },
      {
        "id": "F",
        "label": "Checked by Karel"
      }
    ],
    "speaker_tags": [
      {
        "id": "A,",
        "label": "ATCO tower",
        "likelihood": 0,
        "color": "#ffffff"
      },
      {
        "id": "G,",
        "label": "UNK-1",
        "likelihood": 0,
        "color": "#993333"
      },
      {
        "id": "H,",
        "label": "UNK-2",
        "likelihood": 0,
        "color": "#884444"
      },
      {
        "id": "I,",
        "label": "UNK-3",
        "likelihood": 0,
        "color": "#775555"
      },
      {
        "id": "XT,",
        "label": "XT",
        "likelihood": 0,
        "color": "#333333"
      }
    ],
    "segment_tags": [
      {
        "id": "noisy",
        "label": "Very noisy segment"
      },
      {
        "id": "empty",
        "label": "Empty segment"
      },
      {
        "id": "checked",
        "label": "Transcript OK"
      }
    ],
    "text_tags": [
      {
        "label": "callsign",
        "title": "Callsign",
        "color": "#66d2d6"
      },
      {
        "label": "command",
        "title": "Command",
        "color": "#fbc740"
      },
      {
        "label": "value",
        "title": "Value",
        "color": "#bd97cb"
      },
      {
        "label": "value",
        "title": "Unnamed phrase",
        "color": "#a5cb97"
      },
      {
        "label": "anonymize",
        "title": "Anonymize",
        "color": "#e56997"
      },
      {
        "label": "nonenglish",
        "title": "nonEnglish",
        "color": "#d0ab99"
      }
    ],
    "links": [
      {
        "url": "https://www.spokendata.com/atco2/annotation-manual",
        "label": "Annotation manual"
      },
      {
        "url": "https://aim.rlp.cz/vfrmanual/actual/lkpr_text_en.html",
        "label": "Praha Ruzyne VFR manual"
      }
    ],
    "views": [
      {
        "label": "Traffic map",
        "type": "iframe",
        "url": "https://opensky-network.org/iframe?c=50.1028697,14.2623153&z=10&time=1603948051"
      },
      {
        "label": "ADC",
        "type": "img",
        "url": "https://aim.rlp.cz/vfrmanual/actual/ad/lkpr_adc.jpg"
      },
      {
        "label": "VFRC",
        "type": "img",
        "url": "https://aim.rlp.cz/vfrmanual/actual/ad/lkpr_voc.jpg"
      },
      {
        "label": "HS",
        "type": "img",
        "url": "https://aim.rlp.cz/vfrmanual/actual/ad/lkpr_hs.jpg"
      },
      {
        "label": "PDC",
        "type": "img",
        "url": "https://aim.rlp.cz/vfrmanual/actual/ad/lkpr_pdc.jpg"
      },
      {
    "label": "Waypoints",
    "type": "text",
    "text": "List of waypoints in area of 60km:\n AKEVA ANEXO ARVEG BAGRU BAROX BAVIN BEKVI BULEK DIKVA DOBEN DOKEL EKMES EKROT ELMEK ELPON ERASU ESINU EVEMI GOLIN GOLOP GOPSI GOSEK KENOK KUVIX LEMBI LETNA NEPOV NIMUL ODPAL RATEV RISUK SOMIS SULOV TIPR" +
"U ULNIP UTORO VENOX"
  }
  ,{
    "label": "Callsigns",
    "type": "text",
    "text": "List of callsigns in -1 hour and +0 hour:\nDINNN Aerodin November November\nDLH8YX Lufthansa Eight Yankee X-ray\nEWG4213 Eurowings Four Two One Three\nOKFAK Oscar Kilo Foxtrot Alfa Kilo\nOKHEZ Oscar Kilo Hotel Echo Zulu\nOKPUS34 Okapi Unif" +
"orm Sierra Three Four\nRYR3418 Ryan Three Four One Eight\nTAP124V Air Portugal One Two Four Victor\nTXLU04 Taxi Cozatl Uniform Zero Four\nUAE45 Emirates Four Five\n"
  }
  ,{
    "label": "Sorted Waypoint-Callsign pairs",
    "type": "text",
    "text": "List of waypoints in area of 60km | List of callsigns in -1 hour and +0 hour:\n    AKEVA  |  DINNN Aerodin November November\n    ANEXO  |  DLH8YX Lufthansa Eight Yankee X-ray\n ARVEG  |  EWG4213 Eurowings Four Two One Three\n    BAGRU" +
" |  OKFAK Oscar Kilo Foxtrot Alfa Kilo\n    BAROX  |  OKHEZ Oscar Kilo Hotel Echo Zulu\n    BAVIN  |  OKPUS34 Okapi Uniform Sierra Three Four\n    BEKVI  |  RYR3418 Ryan Three Four One Eight\n BULEK  |  TAP124V Air Portugal One Two Four Victor\n    DI" +
"KVA  |  TXLU04 Taxi Cozatl Uniform Zero Four\n    DOBEN  |  UAE45 Emirates Four Five\n    DOKEL  |           \n    EKMES  | \n    EKROT  |           \n    ELMEK  |           \n    ELPON |           \n    ERASU  |           \n    ESINU  |" +
"     \n    EVEMI  |           \n    GOLIN  |           \n    GOLOP |           \n    GOPSI  |           \n    GOSEK  |           \n KENOK  |           \n    KUVIX  |           \n    LEMBI  | \n    LETNA  |           \n    NEPOV  |" +
" \n    NIMUL  |           \n    ODPAL  |           \n    RATEV |           \n    RISUK  |           \n    SOMIS  |           \n SULOV  |           \n    TIPRU  |           \n    ULNIP  | \n    UTORO  |           \n    VENOX  |           \n"
  }
    ]
  }
}

const initialState = {
    jobId: "7Nm4rHgnMvIKAxqT",
    jobData: jobData,
    jobLastSaveTime: null,
    autosaveEnabled: true,
    autosaveInterval: 120000
};

const JobReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "JOB_INITIALIZE":
            return {
                ...state,
                jobData: action.payload,
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
        default:
            return state;
    }
}

export default JobReducer;