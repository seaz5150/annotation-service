import LogRocket from 'logrocket';
import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import EventReactor from './components/renderless-components/EventReactor';
import HotkeyListener from './components/renderless-components/HotkeyListener';
import Initializator from './components/renderless-components/Initializator';
import SettingsWindow from './components/SettingsWindow';

function App() {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  useEffect(() => {
    LogRocket.init('jdskdq/annotationservice');
  }, []);

  return (
    <div className="App">
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
  );
}

export default App;
