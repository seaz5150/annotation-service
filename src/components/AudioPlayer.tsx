import React, {
  useEffect,
  useRef,
  useState
} from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import { getFormattedTime, rgbaToHexAlpha } from "../CommonUtilities";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";
import { v4 as uuidv4 } from "uuid";
import { UnassignedColor } from "../enums/SegmentColors";
import sizeMe from "react-sizeme";

const url = "https://audio.jukehost.co.uk/CQlpPUaaYwtJknyv7cgNCQxADk0OVCJr.wav";

interface AudioPlayerInterface {
  updateElementGridSize: any,
  size: any
}

function AudioPlayer(props: AudioPlayerInterface) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentZoom, setCurrentZoom] = useState();
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [durationTime, setDurationTime] = useState<number | undefined>(undefined);
  const intervalRef = useRef<any>(null);

  const [audioReady, setAudioReady] = useState(false);

  const audioPlay = useSelector((state: any) => state.audioPlay);

  const transcript = useSelector((state: any) => state.recordingTranscript);
  const segments = transcript.segments;
  const speakerTags = useSelector((state: any) => state.recordingTranscript.speakerTags);

  const segmentColorAlpha = 0.4; // Alpha values 0-1

  const dispatch = useDispatch();
  const { createActionTranscriptSegmentUpdate, 
          createActionTranscriptSegmentCreate, 
          createActionTranscriptSegmentsOverwrite, 
          createActionHistoryDeleteSegmentActions } = bindActionCreators(actionCreators, dispatch);

  const windingUnit = 0.1;
  const windingSpeed = 10;

  var regionCreatedByUser = false;

  const { width, height } = props.size;

  const segmentRefs = useSelector((state: any) => state.references.segmentRefs);

  useEffect(() => {
    props.updateElementGridSize("AudioPlayer", height);
  }, [height]);

  useEffect(() => {
    if (audioReady) {
      switch (transcript.type) {
        case "TRANSCRIPT_INITIALIZE":
          addSegments();
          break;
         case "TRANSCRIPT_SEGMENT_DELETE":
          createActionHistoryDeleteSegmentActions(transcript.segmentId);
          wavesurfer.current?.clearRegions();
          addSegments();
          break;
        case "TRANSCRIPT_SEGMENT_UPDATE":
          wavesurfer.current?.clearRegions();
          addSegments();
          break;
        case "TRANSCRIPT_SEGMENTS_OVERWRITE":
          wavesurfer.current?.clearRegions();
          addSegments();
          break;
      }
    }
  }, [transcript, audioReady]);

  const addSegments = () => {
    for (var segment in segments) {
      var segmentObj = segments[segment];

      var segmentSpeakerTag = speakerTags.find((tag: { id: any; }) => tag.id === segmentObj.speaker);
      var segmentSpeakerTagColor = (segmentSpeakerTag ? segmentSpeakerTag.color : UnassignedColor)
      segmentSpeakerTagColor = segmentSpeakerTagColor + rgbaToHexAlpha(segmentColorAlpha);

      wavesurfer.current?.addRegion({
        id: segmentObj.id,
        start: segmentObj.start,
        end: segmentObj.end,
        color: segmentSpeakerTagColor,
        minLength: 0.2
      });
    }
  };
  
  const scrollToSegment = (region: { id: any; }) => {
    var enteredSegmentRef = segmentRefs.find((segmentRef: { id: any; }) => segmentRef.id === region.id);
    enteredSegmentRef && enteredSegmentRef.ref.scrollIntoView({behavior: "smooth", block: "center"});
  };

  useEffect(() => {
    wavesurfer.current?.un("region-in", (region) => scrollToSegment(region));
    wavesurfer.current?.on("region-in", (region) => scrollToSegment(region));
  }, [segmentRefs]);

  useEffect(() => {
    if (audioReady) {
      switch (audioPlay.type) {
        case "AUDIO_PLAY_SEGMENT":
          wavesurfer.current?.regions.list[audioPlay.segmentId].play();
          break;
        case "AUDIO_PLAY_FROM_TIME":
          wavesurfer.current?.play(audioPlay.time);
          break;
        default:
      }
    }
  }, [audioPlay]);

  const formWaveSurferOptions = (ref: any) => ({
    container: ref,
    normalize: true,
    partialRender: true,
    responsive: true,
    hideScrollbar: true,
    // vertical: true,
    barWidth: 1,
    pixelRatio: 1,
    waveColor: "#969393",
    progressColor: "rgba(42, 171, 210, 0.3)",
    cursorColor: "#2aabd2",
    height: 70,
    plugins: [
      RegionsPlugin.create({
        dragSelection: true,
        minLength: 0.2
      }),
      TimelinePlugin.create({
          container: "#wave-timeline",
          primaryColor: "white",
          primaryFontColor: "white",
          secondaryColor: "rgb(184, 184, 184)",
          secondaryFontColor: "rgb(184, 184, 184)"
      })
    ]
  });

  useEffect(() => {
    setPlaying(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function() {
      if (wavesurfer.current) {
        setAudioReady(true);

        wavesurfer.current.setVolume(volume);
        setVolume(volume);

        setDurationTime(wavesurfer.current?.getDuration());

        wavesurfer.current?.on("region-update-end", (region) => {
          if (regionCreatedByUser === true) {
            regionCreatedByUser = false;
            createActionTranscriptSegmentCreate(region.id, region.start, region.end);
          }
          else {
            createActionTranscriptSegmentUpdate(region.id, region.start, region.end, undefined);
          }
        });

        wavesurfer.current?.on("region-created", (region) => {
          const newRegionIdBeginning = "wavesurfer_";
          if ((region.id).substr(0, newRegionIdBeginning.length) === newRegionIdBeginning) {
            region.color = "#dadada" + rgbaToHexAlpha(segmentColorAlpha);
            region.id = uuidv4();
            regionCreatedByUser = true;
          }
        });

        wavesurfer.current?.on("pause", () => {setPlaying(false)});
        wavesurfer.current?.on("play", () => {setPlaying(true)});
        wavesurfer.current?.on("audioprocess", () => {setCurrentTime(wavesurfer.current?.getCurrentTime())});
        wavesurfer.current?.on("seek", () => {setCurrentTime(wavesurfer.current?.getCurrentTime())});
      }
  });
    
    return () => wavesurfer.current!.destroy();
  }, [url]);

  const handlePress = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }

  const playAudio = () => {
    wavesurfer.current?.playPause();
  };

  const replayAudio = () => {
    wavesurfer.current?.stop();
    playAudio();
  };

  // TODO: Fix sound being stuck on mute when forwarding at the end of audio.
  const startSkip = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, direction: string) => {
    handlePress(e)
    if (intervalRef.current) return;
    wavesurfer.current?.setMute(true);
    intervalRef.current = setInterval(() => {
      let currentWindingUnit = windingUnit;
      if (direction === "backward") {
        currentWindingUnit = -currentWindingUnit;
      }
      wavesurfer.current?.skip(currentWindingUnit);
    }, windingSpeed);
  };

  const stopSkip = () => {
    if (intervalRef.current) {
      wavesurfer.current?.setMute(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="module module-player">
      <div className="module-content">
        <div className="play-area" onMouseDown={e => handlePress(e)}></div>
          <div className="audiocontrols-wrapper">
            <div className="audiocontrols-left">
              <button className="btn btn-primary audiocontrols-button me-2" 
                      onClick={replayAudio}
                      onMouseDown={e => handlePress(e)}
              >
                  <i className="audiocontrols-button-icon bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div className="audiocontrols-center">
              <button className="btn btn-primary audiocontrols-button me-1" 
                      onMouseDown={(e) => startSkip(e, "backward")}
                      onMouseUp={stopSkip}
                      onMouseLeave={stopSkip}
              >
                  <i className="audiocontrols-button-icon bi bi-skip-backward-fill"></i>
              </button>

              <button className="btn btn-primary audiocontrols-button" onClick={playAudio} onMouseDown={e => handlePress(e)}>
                <i className={"audiocontrols-button-icon " + (playing ? "bi bi-pause-fill" : "bi bi-play-fill")}></i>
              </button>

              <button className="btn btn-primary audiocontrols-button ms-1" 
                      onMouseDown={(e) => startSkip(e, "forward")}
                      onMouseUp={stopSkip}
                      onMouseLeave={stopSkip}     
              >
                <i className="audiocontrols-button-icon bi bi-skip-forward-fill"></i>
              </button>
          </div>
          <div className="audiocontrols-right">
            <div className="audiocontrols-times ms-2">
              <p className="recording-time">
                {getFormattedTime(currentTime)}
              </p>
              <p className="recording-time">&nbsp;/&nbsp;</p>
              <p className="recording-time">
                {getFormattedTime(durationTime)}
              </p>
            </div>
            <div className="audiocontrols-volume ms-auto">
                <input type="range" className="form-range audiocontrols-volume-slider" min="0" max="1"  step="0.1"
                  onChange={(e) => (wavesurfer.current?.setVolume(parseFloat(e.target.value)))} onMouseDown={e => handlePress(e)}>
                  </input>
                <i className="audiocontrols-volume-icon bi bi-volume-up-fill ms-2"></i>
              </div>
          </div>
        </div>
        <div id="waveform" ref={waveformRef} onMouseDown={e => handlePress(e)} />
        <div id="wave-timeline"></div>
      </div>
    </div>
  );
}

export default sizeMe({ monitorHeight: true })(AudioPlayer)
