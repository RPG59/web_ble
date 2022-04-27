import logo from "./logo.svg";
import "./App.css";
import { startBle } from "./blsService";

function App() {
  return (
    <div className="App" onClick={() => startBle()}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
