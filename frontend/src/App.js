import { Route, Routes } from "react-router-dom"; // Use only Routes and Route
import "./App.css";
import AllChats from "./components/AllChats";
import ChatPage from "./pages/ChatPage"; // Updated import name to match the file
import Login from "./pages/loginPage";
import AllGroups from "./components/AllGroups";
import CreateGroup from "./components/CreateGroup";
import AllFriends from "./components/AllFriends";
import SearchFriends from "./components/SearchFriends";
import Notifications from "./components/Notifications";
import SignUp from "./pages/SignUp";
import EmailVerification from "./components/EmailVerification";
import VerificationPage from "./pages/VerificationPage";

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
        <Route path="/friendsList" element={<AllFriends />} />
        <Route path="/SearchFriends" element={<SearchFriends />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/verifyEmail" element={<EmailVerification />} />
        <Route path="/verify" element={<VerificationPage />} />



      </Routes>
    </div>
  );
}

export default App;
