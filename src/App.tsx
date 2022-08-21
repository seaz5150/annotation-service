import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import EventReactor from './components/renderless-components/EventReactor';
import HotkeyListener from './components/renderless-components/HotkeyListener';
import Initializator from './components/renderless-components/Initializator';
import SettingsWindow from './components/SettingsWindow';
import { TailSpin } from  'react-loader-spinner';
import { useSelector } from 'react-redux';

function App() {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [transcriptLoaded, setTranscriptLoaded] = useState(false);
  const transcript = useSelector((state: any) => state.recordingTranscript);

  useEffect(() => {
    setTranscriptLoaded(transcript.fullTranscript.length != 0);
  }, [transcript.fullTranscript]);

  return (
    <div className="App">
      <div className={transcriptLoaded ? "d-none" : "loading-overlay-content"}>
        <span className="me-2">Loading transcript</span>
        <TailSpin height = "20"
                  width = "20"
                  color = "rgb(42, 171, 210)"
                  
        />
      </div>
      <div className={transcriptLoaded ? "" : "loading-overlay"}>
        <a id="downloadAnchor" className="none" />
        {/* Renderless components */}
        <Initializator />
        <HotkeyListener />
        <EventReactor />
        {/* Renderless components */}
        
        <Dashboard />
        <div className="settings-button-container">
          <button className="settings-button strip-button-style"
                  onClick={() => setSettingsExpanded(!settingsExpanded)}>
            {settingsExpanded ? <i className="fas fa-caret-down settings-button-caret-icon me-1"></i>
              : <i className="fas fa-caret-up settings-button-caret-icon me-1"></i>
            }
            <i className="fas fa-cog settings-button-gear-icon"></i>
          </button>
        </div>
        <SettingsWindow settingsExpanded={settingsExpanded} />
      </div>
    </div>
  );
}

export default App;
