import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const AllFriends = () => {
  const [friends, setFriends] = useState([]); // State for the full friends list
  const [filteredFriends, setFilteredFriends] = useState([]); // State for filtered friends list
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

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
        setFriends(data); // Set the full friends list
        setFilteredFriends(data.slice(0, 4)); // Set initial filtered friends (first 4)
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFriends();
  }, [userId]);

  // Handle search input changes
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter friends based on search input and slice to 4 items
    const filtered = friends
      .filter((friend) => friend.userName.toLowerCase().includes(searchValue))
      .slice(0, 4);

    setFilteredFriends(filtered);
  };

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

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        {/* Main Section */}
        <div className="p-4 space-y-4">
          {loading ? (
            <p>Loading friends...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 cursor-pointer"
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
                  <h3 className="font-semibold text-gray-800">
                    {friend.firstName} {friend.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 text-left">
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
