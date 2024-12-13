import { Routes, Route } from "react-router-dom";  // Use only Routes and Route
import "./App.css";
import Chats from "./pages/ChatPage";
import Login from "./pages/loginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Define route for Login */}
        <Route path="/" element={<Login />} />
        {/* Define route for Chat */}
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
