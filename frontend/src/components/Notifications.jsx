import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch notifications from the backend
  useEffect(() => {
    const userId = sessionStorage.getItem("userId"); // Get the userId from session or authentication context
    if (!userId) {
      setError("User is not logged in or userId is missing.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/Notifications/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Notifications:", data); // Check the response
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching notifications");
        setLoading(false);
      });
  }, []);

  // Function to handle accepting a friend request
  const handleAccept = (friendRequestId) => {
    fetch(`http://localhost:8080/FriendshipAccepted/${friendRequestId}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // If the response is plain text (like "Friend request accepted")
        }
        throw new Error("Failed to accept friend request");
      })
      .then((data) => {
        console.log("Friendship Accepted:", data);
        // Remove the notification from the list after it has been accepted
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.friend_request_id !== friendRequestId
          )
        );
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
      });
  };

  // Function to handle declining a friend request
  const handleDecline = (friendRequestId) => {
    fetch(`http://localhost:8080/FriendshipRejected/${friendRequestId}`, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // If the response is plain text (like "Friend request rejected")
        }
        throw new Error("Failed to reject friend request");
      })
      .then((data) => {
        console.log("Friendship Declined:", data);
        // Remove the notification from the list after it has been rejected
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.friend_request_id !== friendRequestId
          )
        );
      })
      .catch((error) => {
        console.error("Error declining friend request:", error);
      });
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
            <p>Loading notifications...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) =>
              notification.status === "PENDING" ? (
                <div
                  key={notification.friend_request_id}
                  className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg"
                >
                  {/* Placeholder Avatar */}
                  <div className="flex items-center">
                    <img
                      src="https://icons-for-free.com/iff/png/512/home+page+profile+user+icon-1320184041392976124.png"
                      alt="Avatar"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800 text-left">
                        {notification.sender_first_name}{" "}
                        {notification.sender_last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Username: @{notification.sender_username}
                      </p>
                      <p className="text-sm text-gray-500 text-left">
                        Status: {notification.status}
                      </p>
                    </div>
                  </div>

                  {/* Display buttons only if the status is "PENDING" */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleAccept(notification.friend_request_id)
                      }
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Accept Friend
                    </button>
                    <button
                      onClick={() =>
                        handleDecline(notification.friend_request_id)
                      }
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Decline Friend
                    </button>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div className="flex justify-center items-center h-64 bg-white shadow-md rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-600 mb-4">
                  No notifications available
                </p>
                <p className="text-gray-400">
                  It seems like you have no pending friend requests at the
                  moment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
