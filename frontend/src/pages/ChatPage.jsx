import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import SideBar from "../components/SideBar"; // Assure-toi que le chemin est correct

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const chatId = 9;

  useEffect(() => {
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
        subscriptionRef.current = client.subscribe(
          `/topic/messages/${chatId}`,
          (message) => {
            if (message.body.startsWith("{") && message.body.endsWith("}")) {
              try {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  receivedMessage,
                ]);
              } catch (error) {
                console.error("Error parsing message:", message.body, error);
              }
            } else {
              console.warn("Received non-JSON message:", message.body);
            }
          }
        );
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        subscriptionRef.current = null;
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.connected) {
        client.deactivate();
      }
      subscriptionRef.current = null;
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("WebSocket client is not connected.");
      return;
    }

    const senderId = parseInt(sessionStorage.getItem("userId"), 10);
    if (!senderId || !messageContent.trim()) {
      console.error("Invalid senderId or empty message.");
      return;
    }

    const payload = {
      senderId,
      chatId,
      content: messageContent.trim(),
    };

    console.log("Sending message:", payload);
    stompClientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });

    setMessageContent("");
  };

  return (
    <div className="h-screen flex">
      {/* Side bar */}
      <SideBar /> {/* Le composant SideBar est maintenant utilisé ici */}
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
