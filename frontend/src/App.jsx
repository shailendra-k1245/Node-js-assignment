import { useState } from "react";

import "./App.css";
import { Home } from "./components/Home";

function App() {
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className="App">
      <p onClick={() => setShowUsers(!showUsers)}>
        Click to {showUsers ? "Hide" : "Show"}List
      </p>
      {showUsers ? <Home /> : ""}
      <p>Click to register</p>
    </div>
  );
}

export default App;
