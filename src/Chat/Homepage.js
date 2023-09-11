// Import React and necessary Firebase libraries
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy, // Add this line
} from "firebase/firestore";

// Import the SearchBar component
import { SearchBar } from "./SearchBar";

export const Homepage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    // Set up Firebase Realtime Database or Firestore listener here
    const unsubscribe = onSnapshot(
      query(messagesRef, orderBy("createdAt")), // Use orderBy here
      (snapshot) => {
        let messages = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messages);
      }
    );

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, [messagesRef]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      selectedUser, // Use the selectedUser here
    });

    setNewMessage("");
  };

  const handleStartChat = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {selectedUser ? selectedUser.username : ""}</h1>
      </div>
      
      {!selectedUser ? (
        <div>
          <SearchBar handleStartChat={handleStartChat} />
          <div className="user-list">
            {/* Render a list of users from your database */}
            {/* Display a list of users here */}
          </div>
          <div className="messages">
        {/* Render messages here */}
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="user">{message.user}:</span> {message.text}
          </div>
        ))}
      </div>
        </div>
      ) : (
        <div className="chat-interface">
          {/* Render the chat interface here */}
          {/* You can use selectedUser to display the chat interface */}
        </div>
      )}
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};
