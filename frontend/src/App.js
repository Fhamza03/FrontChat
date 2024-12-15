import { Route, Routes } from "react-router-dom"; // Use only Routes and Route
import "./App.css";
import AllChats from "./components/AllChats";
import ChatPage from "./pages/ChatPage"; // Updated import name to match the file
import Login from "./pages/loginPage";
import AllGroups from "./components/AllGroups";
import CreateGroup from "./components/CreateGroup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Updated route to include dynamic chatId */}
        <Route path="/MessagesChat/:chatId" element={<ChatPage />} />
        <Route path="/AllChats" element={<AllChats />} />
        <Route path="/GroupList" element={<AllGroups />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />

      </Routes>
    </div>
  );
}

export default App;
