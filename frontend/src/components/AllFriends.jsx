import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const AllFriends = () => {
  const [friends, setFriends] = useState([]); // State for friends list
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  const userId = sessionStorage.getItem("userId"); // Retrieve userId from session storage

  useEffect(() => {
    // Fetch friends list from the API
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/getFriends/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch friends list");
        }
        const data = await response.json();
        setFriends(data); // Set the friends list
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFriends();
  }, [userId]);

  // Handler for friend click (optional logic can be added)
  const handleFriendClick = (friendId) => {
    console.log("Friend clicked:", friendId);
    // Add navigation or action logic here
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
            <p>Loading friends...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg"
                onClick={() => handleFriendClick(friend.id)} // Add click handler
              >
                {/* Placeholder Avatar */}
                <img
                  src="https://icons-for-free.com/iff/png/512/home+page+profile+user+icon-1320184041392976124.png"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                {/* Friend Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 flex justify-start">
                    {friend.firstName} {friend.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 flex justify-start">
                    @{friend.userName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No friends found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFriends;
