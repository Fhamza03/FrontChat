import React, { useState, useEffect } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown visibility
  const userId = sessionStorage.getItem("userId");

  // Fetch the list of users when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getFriends/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userId]); // Added userId to the dependency array to re-fetch if the userId changes

  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter((user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) // Use `userName` instead of `username`
      )
    : users;

  // Function to add user to the group when clicked
  const handleAddUser = (user) => {
    if (!userList.includes(user)) {
      setUserList([...userList, user]);
    }
    setIsDropdownOpen(false); // Close dropdown after selecting a user
  };

  // Function to remove user from the group
  const handleRemoveUser = (id) => {
    setUserList(userList.filter((user) => user.userId !== id)); // Use `userId` here as well
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!groupName || userList.length === 0) {
      alert("Please fill out all fields and add at least one user");
      return;
    }
  
    // Prepare the group data
    const groupData = {
      name: groupName,
      userGroups: userList.map((user) => ({
        userId: user.userId,  // Ensure the user ID is sent for each user
      })),
    };
  
    const currentUserId = sessionStorage.getItem("userId"); // Get the current user from session
  
    try {
      setLoading(true); // Set loading state while waiting for the response
  
      // Step 1: Create the group
      const response = await fetch("http://localhost:8080/CreateGroupe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
  
      const createdGroup = await response.json();
      console.log("Group created successfully:", createdGroup);
  
      // Step 2: Add the current user to the group
      const addCurrentUserResponse = await fetch(
        `http://localhost:8080/addUserToGroup/${createdGroup.groupId}/${currentUserId}`,
        {
          method: "POST",
        }
      );
  
      if (!addCurrentUserResponse.ok) {
        throw new Error(`Failed to add the current user to the group`);
      }
      console.log(`User with ID ${currentUserId} added to the group`);
  
      // Step 3: Add other users to the group
      for (const user of userList) {
        const addUserResponse = await fetch(
          `http://localhost:8080/addUserToGroup/${createdGroup.groupId}/${user.userId}`,
          {
            method: "POST",
          }
        );
  
        if (!addUserResponse.ok) {
          throw new Error(`Failed to add user ${user.username} to the group`);
        }
        console.log(`User ${user.username} added to the group`);
      }
  
      // Step 4: Change the role of the current user
      const changeRoleResponse = await fetch(
        `http://localhost:8080/changeRole/${currentUserId}/${createdGroup.groupId}`,
        {
          method: "PUT",
        }
      );
  
      if (!changeRoleResponse.ok) {
        throw new Error(`Failed to change the role of the current user`);
      }
  
      console.log(`Role of the current user changed`);
  
      alert("Group created and users added successfully, role updated!");
  
      // Optionally, reset form state if needed
      setGroupName("");
      setUserList([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating group or adding users. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  

  return (
    <div className="h-screen flex bg-[#DBE2EF]">
      <SideBar />
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header />

        {/* Main Section */}
        <div className="p-4 space-y-6 bg-[#DBE2EF]">
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Group Name Input */}
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-lg font-medium text-[#3F72AF] text-left"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-2 p-2 mb-2 w-full border border-gray-300 rounded-md "
                  placeholder="Enter group name"
                />
              </div>

              {/* User Search and List */}
              <div className="relative">
                <label
                  htmlFor="users"
                  className="block text-lg font-medium text-[#3F72AF] text-left"
                >
                  Select User
                </label>
                <div className="relative">
                  {/* Search Input */}
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2 p-2 mb-2 w-full border border-gray-300 rounded-md"
                    placeholder="Search for users"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
                  />

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <ul className="mt-2 border border-gray-300 rounded-md max-h-48 overflow-y-auto absolute w-full bg-white z-10">
                      {filteredUsers.map((user) => (
                        <li
                          key={user.userId} // Use `user.userId` here for a unique key
                          onClick={() => handleAddUser(user)}
                          className="p-2 hover:bg-gray-200 cursor-pointer text-left"
                        >
                          {user.userName} {/* Use `user.userName` for display */}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Display added users */}
              {userList.length > 0 && (
                <div className="mt-4">
                  <h3 className="block text-lg font-medium text-[#3F72AF] text-left">
                    Added Users
                  </h3>
                  <ul className="space-y-2">
                    {userList.map((user) => (
                      <li
                        key={user.userId} // Use `user.userId` for a unique key
                        className="flex items-center justify-between border-b border-gray-300 py-2"
                      >
                        <span>{user.userName}</span> {/* Use `user.userName` for display */}
                        <button
                          onClick={() => handleRemoveUser(user.userId)}
                          className="py-2 px-5 text-red-500"
                        >
                          Remove from list
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-start">
                <button
                  type="submit"
                  className="mt-4 text-sm bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white px-6 py-3 rounded-lg shadow-md hover:from-[#112D4E] hover:to-[#3F72AF] focus:outline-none focus:ring-4 focus:ring-[#3F72AF] transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
