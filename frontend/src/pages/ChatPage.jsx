import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";

const ChatPage = () => {
  const { chatId } = useParams(); // Retrieve chatId from the URL
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const stompClientRef = useRef(null); // Reference to store the Stomp client
  const subscriptionRef = useRef(null); // Reference to store the subscription
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  useEffect(() => {
    if (!chatId) return; // Ensure chatId is defined

    // Fetch existing messages for the chat from the backend
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getMessages/${chatId}`);
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
              setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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

    const senderId = parseInt(sessionStorage.getItem("userId"), 10);
    if (!senderId || !messageContent.trim()) {
      console.error("Invalid senderId or empty message.");
      return;
    }

    const newMessage = {
      senderId,
      chatId: parseInt(chatId, 10),
      content: messageContent.trim(),
    };

    try {
      // Send the message to the backend via WebSocket
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(newMessage),
      });

      setMessageContent(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, handle the error by removing the optimistically added message if the request fails
    }
  };

  return (
    <div className="h-screen flex">
      {/* Side bar */}
      <SideBar />
      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-[#DBE2EF] text-white p-4">
          <h1 className="text-lg font-semibold">Chat Application</h1>
        </header>

        {/* Main Section */}
        <main className="flex-grow bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-bold mb-4">Chat Room</h2>
            <div className="border border-gray-300 h-64 overflow-y-scroll p-2 mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.senderId}:</strong> {msg.content}
                </div>
              ))}
              {/* Scroll to the bottom */}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message"
                className="flex-grow border border-gray-300 rounded-l p-2"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded-r"
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
