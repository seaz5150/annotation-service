import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import { WaveSurfer, WaveForm, Region } from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import Button from "react-bootstrap/Button"

const windingUnit = 0.1;
const windingSpeed = 10;

const url = "https://audio.jukehost.co.uk/Z26Iwin2gXvItglzITnoCT96fCpzo9Bh.mp3";

export default function AudioPlayer() {
  const [playing, setPlayStatus] = useState(false);
  const intervalRef = useRef(null);

  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: { 
          dragSelection: true,
          minLength: 0.2
        }
      },
      {
        plugin: TimelinePlugin,
        options: { container: "#timeline" }
      }
    ]
  }, []);

  const [regions, setRegions] = useState([
    // {
    //   id: "region-1",
    //   start: 0.5,
    //   end: 10,
    //   color: "rgba(0, 0, 0, .5)",
    //   data: {
    //     systemRegionId: 31
    //   }
    // },
    // {
    //   id: "region-2",
    //   start: 5,
    //   end: 25,
    //   color: "rgba(225, 195, 100, .5)",
    //   data: {
    //     systemRegionId: 32
    //   }
    // },
    // {
    //   id: "region-3",
    //   start: 15,
    //   end: 35,
    //   color: "rgba(25, 95, 195, .5)",
    //   data: {
    //     systemRegionId: 33
    //   }
    // }
  ]);

  // On player unmounted
  useEffect(() => {
    return () => stopSkip();
  }, []);

  // use regions ref to pass it inside useCallback
  // so it will use always the most fresh version of regions list
  const regionsRef = useRef(regions);

  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  const regionCreatedHandler = useCallback(
    region => {
      if (region.data.systemRegionId) return;

      setRegions([
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } }
      ]);
    },
    [regionsRef]
  );

  const wavesurferRef = useRef();
  const handleWSMount = useCallback(
    waveSurfer => {
      wavesurferRef.current = waveSurfer;
      if (wavesurferRef.current) 
      {
        wavesurferRef.current.load(url);

        wavesurferRef.current.on("region-created", regionCreatedHandler);

        if (window) 
        {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [regionCreatedHandler]
  );

  const playAudio = useCallback(() => {
    setPlayStatus(!playing);
    wavesurferRef.current.playPause();
  }, [playing]);

  const startSkip = useCallback((direction) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      let currentWindingUnit = windingUnit;
      if (direction === "backward")
      {
        currentWindingUnit = -currentWindingUnit;
      }
      wavesurferRef.current.skip(currentWindingUnit);
    }, windingSpeed);
  }, []);

  const stopSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePress = (e) => {
      e.stopPropagation();
  }

  return (
    <div className="card card-body module">

      <WaveSurfer plugins={plugins} onMount={handleWSMount} onMouseDown={handlePress}>
        <WaveForm id="waveform"
         height="100"
         barWidth="2"
         responsive= "true"
         normalize= "true"
         partialRender= "true"
         pixelRatio= "1"
         waveColor= "#969393"
         progressColor= "#2aabd2"
         cursorColor= "#2aabd2"
         >
          {regions.map(regionProps => (
            <Region
              key={regionProps.id}
              {...regionProps}
            />
          ))}
        </WaveForm>

        <div id="timeline" />
      </WaveSurfer>

      <div className="audiocontrols">
        <Button className="audiocontrols-button mx-1" 
                onMouseDown={() => startSkip("backward")}
                onMouseUp={stopSkip}
                onMouseLeave={stopSkip}
        >
            <i className="audiocontrols-button-icon bi bi-skip-backward-fill"></i>
        </Button>

        <Button className="audiocontrols-button" onClick={playAudio}>
          <i className={"audiocontrols-button-icon " + (playing ? "bi bi-pause-fill" : "bi bi-play-fill")}></i>
        </Button>

        <Button className="audiocontrols-button mx-1" 
                onMouseDown={() => startSkip("forward")}
                onMouseUp={stopSkip}
                onMouseLeave={stopSkip}
        >
            <i className="audiocontrols-button-icon bi bi-skip-forward-fill"></i>
        </Button>

        {/* <input type="range" className="" min="0" max="5" step="0.5" id="customRange3"></input> */}
      
      </div>
    </div>
  );
}
