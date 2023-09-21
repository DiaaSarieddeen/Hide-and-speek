// Import necessary dependencies from React and Firebase
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import Firebase authentication and Firestore database
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  where
} from "firebase/firestore"; // Import Firestore functions for querying and data manipulation
import "./Homepage.css"; // Import a CSS file for styling
import { SearchBar } from "./SearchBar"; // Import a component named SearchBar

// Define a functional component named Homepage
export const Homepage = () => {
  // Define various pieces of state using the useState hook
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(""); // State for the new message input
  const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("selectedUser"))); // State for the selected user
  const [users, setUsers] = useState([]); // State for the list of users

  // Reference to the 'messages' collection in Firestore
  const messagesRef = collection(db, "messages");

  // useEffect hook to subscribe to changes in the 'messages' collection
  useEffect(() => {
    if (!selectedUser) return; // If no user is selected, do nothing

    // Subscribe to changes in the 'messages' collection with specific conditions
    const unsubscribe = onSnapshot(
      query(
        messagesRef,
        where("selectedUser", "==", selectedUser.username), // Filter messages by selected user
        orderBy("createdAt") // Order messages by their creation timestamp
      ),
      (snapshot) => {
        // Process the snapshot and update the 'messages' state
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe from Firestore changes
  }, [selectedUser]); // Run this effect when 'selectedUser' changes

  // useEffect hook to fetch a list of users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData); // Update the 'users' state with fetched data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the function to fetch users when the component mounts
  }, []); // Run this effect only once when the component mounts

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (newMessage.trim() === "") return;
  
    // Check if there's a user object and it has a displayName
    if (auth.currentUser && auth.currentUser.displayName) {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        selectedUser: selectedUser.username,
      });
    } else {
      // Handle the case where the user is not authenticated or doesn't have a displayName
      console.error("User is not authenticated or doesn't have a displayName");
    }
  
    setNewMessage("");
  };
  

  // Function to handle starting a chat with a user
  const handleStartChat = (user) => {
    setSelectedUser(user); // Set the selected user in state
    localStorage.setItem("selectedUser", JSON.stringify(user)); // Store the selected user in local storage
  };

  // Render the user interface
  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {selectedUser ? selectedUser.username : ""}</h1>
      </div>
      {!selectedUser ? (
        // Render the user list and search bar when no user is selected
        <div>
          <SearchBar handleStartChat={handleStartChat} users={users} />
          <div className="user-list">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleStartChat(user)} // Call handleStartChat when a user is clicked
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Render the chat interface when a user is selected
        <div>
          <button onClick={() => setSelectedUser(null)}>Back</button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id}>
                <h4>{message.user}</h4>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
