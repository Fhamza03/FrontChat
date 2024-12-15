import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import SideBar from "./SideBar";
import Header from "./Header";

const AllChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Initialize useNavigate hook
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    // Fetch chat data from the backend
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getAllChats/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    // Navigate to the MessagesChat route with the chat_id
    navigate(`/MessagesChat/${chatId}`);
  };

  return (
    <div className="h-screen flex bg-[#DBE2EF]">
      <SideBar />
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header />

        {/* Main Section */}
        <div className="p-4 space-y-4">
          {loading ? (
            <p>Loading chats...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : chats.length > 0 ? (
            chats.map((chat, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg"
                onClick={() => handleChatClick(chat.chat_id)}  // Add click handler
              >
                {/* Placeholder Avatar */}
                <img
                  src="https://icons-for-free.com/iff/png/512/home+page+profile+user+icon-1320184041392976124.png"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                {/* Chat Info */}
                <div className="">
                  <h3 className="font-semibold text-gray-800 flex justify-start">
                    {chat.friend_username}
                  </h3>
                  <p className="text-sm text-gray-600 flex justify-start">
                    Message
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No chats found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllChats;
