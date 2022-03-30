import { Tooltip } from 'bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import Dashboard from './components/Dashboard';
import EventReactor from './components/renderless-components/EventReactor';
import HotkeyListener from './components/renderless-components/HotkeyListener';
import SettingsWindow from './components/SettingsWindow';

function App() {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  return (
    <div className="App">
      <Dashboard />
      <button className="settings-button strip-button-style"
              onClick={() => setSettingsExpanded(!settingsExpanded)}>
        {settingsExpanded ? <i className="fas fa-caret-down settings-button-caret-icon me-1"></i>
          : <i className="fas fa-caret-up settings-button-caret-icon me-1"></i>
        }
        <i className="fas fa-cog settings-button-gear-icon"></i>
      </button>
      <SettingsWindow settingsExpanded={settingsExpanded} />

      {/* Renderless components */}
      <HotkeyListener />
      <EventReactor />
    </div>
  );
}

export default App;
