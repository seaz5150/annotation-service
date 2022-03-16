import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import SettingsWindow from './components/SettingsWindow';

function App() {
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  return (
    <div className="App">
      <Dashboard />
      <button className="settings-button strip-button-style" onClick={() => setSettingsExpanded(!settingsExpanded)}>
        <i className="fas fa-cog"></i>
      </button>
      <SettingsWindow settingsExpanded={settingsExpanded} />
    </div>
  );
}

export default App;
