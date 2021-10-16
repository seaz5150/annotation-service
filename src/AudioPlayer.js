import WaveSurfer from "wavesurfer";
import React, { useEffect, useRef, useState } from "react";

const formWaveSurferOptions = ref => ({
   container: ref,
//   waveColor: "#eee",
//   progressColor: "OrangeRed",
//   cursorColor: "OrangeRed",
//   barWidth: 2,
//   barRadius: 2,
//    responsive: true,

//   // If true, normalize by the maximum peak instead of 1.0.
//   normalize: true,
//   // Use the PeakCache to improve rendering speed of large waveforms.
//   partialRender: true,
  vertical: true
});

export default function AudioPlayer({ url }) {
    function handlePress(e) {
        e.stopPropagation();
      };

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function() {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div>
      <div className="controls">
        <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>
      </div>
      <div id="waveform" ref={waveformRef} onMouseDown={handlePress}/>
    </div>
  );
}