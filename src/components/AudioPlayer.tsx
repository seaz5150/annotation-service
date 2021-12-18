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

const url = "https://audio.jukehost.co.uk/Z26Iwin2gXvItglzITnoCT96fCpzo9Bh.mp3";

export default function AudioPlayer() {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentZoom, setCurrentZoom] = useState();
  const intervalRef = useRef<any>(null);

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

        wavesurfer.current?.on("pause", () => {setPlaying(false)});
        wavesurfer.current?.on("play", () => {setPlaying(true)});
      }
    });
    
    return () => wavesurfer.current!.destroy();
  }, [url]);

  const handlePress = (e: any) => {
    e.stopPropagation();
  }

  useEffect(() => {
    return () => stopSkip();
  }, []);

  const playAudio = useCallback(() => {
    wavesurfer.current?.playPause();
  }, []);

  const replayAudio = useCallback(() => {
    wavesurfer.current?.stop();
    playAudio();
  }, [playAudio]);

  const startSkip = useCallback((e, direction) => {
    handlePress(e)
    if (intervalRef.current) return;
    wavesurfer.current?.setMute(true);
    intervalRef.current = setInterval(() => {
      let currentWindingUnit = windingUnit;
      if (direction === "backward")
      {
        currentWindingUnit = -currentWindingUnit;
      }
      wavesurfer.current?.skip(currentWindingUnit);
    }, windingSpeed);
  }, []);

  const stopSkip = () => {
    if (intervalRef.current) {
      wavesurfer.current?.setMute(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="card card-body module">
      <div className="module-content">
        <div className="play-area" onMouseDown={e => handlePress(e)}></div>
          <div className="row audiocontrols-wrapper">
            <div className="col audiocontrols">
              {/* <button className="btn btn-primary audiocontrols-button me-1" 
                      onClick={replayAudio}
                      onMouseDown={e => handlePress(e)}
              >
                  <i className="audiocontrols-button-icon bi bi-arrow-clockwise"></i>
              </button> */}

              <button className="btn btn-primary audiocontrols-button mx-1" 
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
              {/* <div className="audiocontrols-volume">
                <i className="audiocontrols-volume-icon bi bi-volume-down-fill me-1"></i>
                <input type="range" className="form-range audiocontrols-volume-slider" min="0" max="1"  step="0.1" onChange={(e) => (wavesurfer.current?.setVolume(parseFloat(e.target.value)))} onMouseDown={e => handlePress(e)}></input>
                <i className="audiocontrols-volume-icon bi bi-volume-up-fill ms-1"></i>
              </div> */}
          </div>
        </div>
        <div id="waveform" ref={waveformRef} onMouseDown={e => handlePress(e)} />
        <div id="wave-timeline"></div>
      </div>
    </div>
  );
}