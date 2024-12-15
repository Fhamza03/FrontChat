import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const ChatPage = () => {
  const { chatId } = useParams(); // Retrieve chatId from the URL
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const stompClientRef = useRef(null); // Reference to store the Stomp client
  const subscriptionRef = useRef(null); // Reference to store the subscription
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom
  const currentUserId = parseInt(sessionStorage.getItem("userId"), 10);

  useEffect(() => {
    if (!chatId) return;

    // Fetch existing messages for the chat from the backend
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/getMessages/${chatId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const fetchedMessages = await response.json();
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const socket = new SockJS("http://localhost:8080/ws", null, {
      withCredentials: true,
    });

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        // Subscribe to the specific chat topic
        subscriptionRef.current = client.subscribe(
          `/topic/messages/${chatId}`,
          (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("Received message:", receivedMessage); // Debugging
              setMessages((prevMessages) => {
                // Add the new message and return a new array to trigger re-render
                return [...prevMessages, receivedMessage];
              });
            } catch (error) {
              console.error("Error parsing message:", message.body, error);
            }
          }
        );
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        subscriptionRef.current = null; // Clear subscription reference
      },
    });

    client.activate();
    stompClientRef.current = client;

    // Cleanup function
    return () => {
      if (client.connected) {
        client.deactivate();
      }
      subscriptionRef.current = null; // Clear subscription on unmount
    };
  }, [chatId]);

  useEffect(() => {
    // Scroll to the latest message when messages are updated
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("WebSocket client is not connected.");
      return;
    }

    if (!currentUserId || !messageContent.trim()) {
      console.error("Invalid senderId or empty message.");
      return;
    }

    const newMessage = {
      senderId: currentUserId, // Correct senderId for current user
      chatId: parseInt(chatId, 10),
      content: messageContent.trim(),
      messageTime: new Date().toISOString(), // ISO 8601 string
    };

    try {
      // Send to backend via WebSocket
      stompClientRef.current.publish({
        destination: `/app/chat.sendMessage`,
        body: JSON.stringify(newMessage),
      });

      setMessageContent(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  
  return (
    <div className="h-screen flex">
      {/* Side bar */}
      <SideBar />
      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <Header />
        {/* Main Section */}
        <main className="flex-grow bg-[#F9F7F7] p-4">
          <div className="bg-[#DBE2EF] shadow-lg rounded-lg p-6">
            <div className="border border-[#DBE2EF] h-[67vh] overflow-y-scroll p-5 mb-6 bg-[#F9FAFB] rounded-lg shadow-sm">
              {messages.map((msg, index) => {
                const messageTime = msg.messageTime || msg.message_time; // Handle both formats
                if (!messageTime) {
                  console.error("Invalid or missing message time:", msg);
                  return null;
                }

                const messageDate = new Date(messageTime);
                if (isNaN(messageDate.getTime())) {
                  console.error("Invalid date:", messageTime);
                  return null;
                }

                const formattedMessageTime = new Intl.DateTimeFormat("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }).format(messageDate);

                return (
                  <div key={index} className="mb-3">
                    <div
                      className={`${
                        msg.senderId === currentUserId ||
                        msg.sender_id === currentUserId
                          ? "bg-[#3F72AF] text-white ml-auto" // Message on the right for current user
                          : "bg-[#DBE2EF] text-[#112D4E]" // Message on the left for others
                      } max-w-[50%] p-4 rounded-lg shadow-sm transition-all duration-300 text-left`}
                    >
                      {/* The user name not well displayed */}
                      {/* <p
          className={`font-semibold text-sm ${
            msg.senderId === currentUserId || msg.sender_id === currentUserId
              ? "text-white"
              : "text-[#112D4E]"
          }`}
        >
          {msg.senderUsername || msg.sender_username}
        </p> */}

                      <p className="text-base">{msg.content}</p>
                      <p className="text-xs text-[#112D4E]">
                        {formattedMessageTime}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Scroll to the bottom */}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message"
                className="flex-grow bg-[#F9F7F7] border border-[#DBE2EF] rounded-l-lg py-3 px-4 text-[#112D4E] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] shadow-lg transition-all duration-300"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-[#3F72AF] to-[#112D4E] text-white px-6 py-3 rounded-lg shadow-md hover:from-[#112D4E] hover:to-[#3F72AF] focus:outline-none focus:ring-4 focus:ring-[#3F72AF] transition-all duration-300 transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
