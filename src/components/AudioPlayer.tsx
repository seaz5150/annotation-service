import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import { PluginDefinition, PluginParams } from "wavesurfer.js/types/plugin";
import moment from "moment";
import { getFormattedTime } from "../TimeUtils";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state/index";

const url = "https://audio.jukehost.co.uk/Z26Iwin2gXvItglzITnoCT96fCpzo9Bh.mp3";

export default function AudioPlayer() {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentZoom, setCurrentZoom] = useState();
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [durationTime, setDurationTime] = useState<number | undefined>(undefined);
  const intervalRef = useRef<any>(null);

  const audioPlay = useSelector((state: any) => state.audioPlay);

  useEffect(() => {
    if (audioPlay.start) {
      playSegment(audioPlay.start, audioPlay.end);
    }
  }, [audioPlay]);

  const windingUnit = 0.1;
  const windingSpeed = 10;

  const formWaveSurferOptions = (ref: any) => ({
    container: ref,
    normalize: true,
    partialRender: true,
    responsive: true,
    // vertical: true,
    barWidth: 1,
    pixelRatio: 1,
    waveColor: "#969393",
    progressColor: "rgba(42, 171, 210, 0.3)",
    cursorColor: "#2aabd2",
    height: 90,
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
        wavesurfer.current.setVolume(volume);
        setVolume(volume);

        setDurationTime(wavesurfer.current?.getDuration());

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

  const playSegment = (start: number, end?: number) => {
    if (start && end) {
      wavesurfer.current?.seekTo(start);
      wavesurfer.current?.play(start, end);
      console.log("Playing from " + start + "to " + end);
    }
    else if (start) {
      wavesurfer.current?.seekTo(start);
      wavesurfer.current?.play(start);
      console.log("Playing from " + start);
    }
  };

  const playAudio = () => {
    wavesurfer.current?.playPause();
  };

  const replayAudio = () => {
    wavesurfer.current?.stop();
    playAudio();
  };

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
    <div className="card card-body module module-player">
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
                <input type="range" className="form-range audiocontrols-volume-slider" min="0" max="1"  step="0.1" onChange={(e) => (wavesurfer.current?.setVolume(parseFloat(e.target.value)))} onMouseDown={e => handlePress(e)}></input>
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