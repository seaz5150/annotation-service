// import './App.css';
import Dashboard from './Dashboard';
import AudioPlayer from "./AudioPlayer"

const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

function App() {
  return (
    <div className="App">
      <div className="content">
        {/* <Dashboard /> */}
        <AudioPlayer url={url}/>
      </div>
    </div>
  );
}

export default App;
