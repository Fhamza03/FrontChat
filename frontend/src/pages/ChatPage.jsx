import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const stompClientRef = useRef(null); // Reference to store the Stomp client
  const subscriptionRef = useRef(null); // Reference to store the subscription
  const chatId = 9;

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws", null, {
      withCredentials: true,
    });

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Unsubscribe if already subscribed to avoid duplicates
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        // Subscribe to the chat topic
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
    <div>
      {/* Chat UI Code */}
      <h2>Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
