import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Header from "./Header";
import SideBar from "./SideBar";

const AllGroups = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch groups when the component mounts
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/AllGroups/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (chatId) => {
    // Navigate to the group chat page using the groupId in the URL
    navigate(`/MessagesChat/${chatId}`);
  };

  return (
    <div className="h-screen flex">
      <SideBar />
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header />

        {/* Main Section */}
        <div className="p-4 space-y-4">
          {loading ? (
            <p>Loading groups...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : groups.length > 0 ? (
            groups.map((group, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg"
                onClick={() => handleGroupClick(group.chatId)} // Trigger navigation on click
              >
                {/* Placeholder Avatar */}
                <img
                  src="https://icons-for-free.com/iff/png/512/home+page+profile+user+icon-1320184041392976124.png"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                {/* Group Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex justify-start">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex justify-start">
                    Role: {group.role}{" "}
                    {/* Displaying the user's role in the group */}
                  </p>
                  <p className="text-sm text-gray-600 flex justify-start">
                    Date Joined:{" "}
                    {new Date(group.dateJoined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No groups found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllGroups;
