import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import AnnotationSegment from './AnnotationSegment';

export default function AnnotationText() {

  useEffect(() => {
    const recordingSegments = recordingJson.transcript.segments;
  }, []);

  return (
    <div className="">
        <AnnotationSegment />
        <AnnotationSegment />
    </div>
  );
}

const recordingJson = {
  "transcript": {

  "id": "da8730a-4645-hcbe35a69-a356-a7e4",

  "time": "2021-03-15T20:12:41Z",

  "source": "Human-4531",

  "speakerTags": [

      {

          "id": "A",

          "label": "ATCO radar"

      },

      {

          "id": "B",

          "label": "TIE690J"

      },

      {

          "id": "C",

          "label": "UNK"

      },

      {

          "id": "XT",

          "label": "Cross talk"

      }

  ],

  "segmentTags": [

      {

          "label": "Very noisy segment",

          "id": "noisy"

      },

      {

          "label": "Empty segment",

          "id": "empty"

      },

      {

          "label": "Transcript OK",

          "id": "checked"

      }

  ],

  "textTags": [

      {

          "label": "Callsign",

          "id": "callsign"

      },

      {

          "label": "Command",

          "id": "command"

      },

      {

          "label": "Argument",

          "id": "argument"

      },

      {

          "label": "Anonymize",

          "id": "anonym"

      }

  ],

  "segments": [

      {

          "start": "0.06",

          "end": "5.60",

          "speaker": "A",

          "language": "English",

          "words": [

              {

                  "label": "Timeair",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Six",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Nine",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Zero",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Juliett",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "contact",

                  "textTags": [

                      "command"

                  ]

              },

              {

                  "label": "ruzyne",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "tower",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "one",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "three",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "four",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "decimal",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "five",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "six",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "zero",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "hezký",

                  "language": "Czech"

              },

              {

                  "label": "večer",

                  "language": "Czech"

              },

              {

                  "label": "ahoj",

                  "language": "Czech"

              }

          ]

      },

      {

          "start": "5.60",

          "end": "10.21",

          "speaker": "B",

          "language": "English",

          "segmentTags": {

              "checked": true

          },

          "words": [

              {

                  "label": "one",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "three",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "four",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "five",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "six",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "zero",

                  "textTags": [

                      "argument"

                  ]

              },

              {

                  "label": "Timeair",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Six",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Nine",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Zero",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "Juliett",

                  "textTags": [

                      "callsign"

                  ]

              },

              {

                  "label": "bye"

              },

              {

                  "label": "díky",

                  "language": "Czech"

              }

          ]

      },

      {

          "start": "10.21",

          "end": "12.90",

          "speaker": "D",

          "words": []

      },

      {

          "start": "14.60",

          "end": "18.21",

          "speaker": "C",

          "segmentTags": [

              "noisy"

          ],

          "words": [

              {

                  "label": "UNK"

              }

          ]

      }

  ]

}};