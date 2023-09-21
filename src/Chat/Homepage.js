
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  where
} from "firebase/firestore";
import "./Homepage.css"; 
import { SearchBar } from "./SearchBar"; 


export const Homepage = () => {

  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("selectedUser"))); 
  const [users,setUsers]=useState([])

 
  const messagesRef = collection(db, "messages");

  
  useEffect(() => {
    if (!selectedUser) return; // If no user is selected, do nothing
  
    // Check if auth.currentUser is not null
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          where("sender", "==", auth.currentUser.displayName), // Filter by the current user 
          where("receiver", "==", selectedUser.username), // Filter by the selected user 
          orderBy("createdAt")
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
    }
  }, [selectedUser]); // Run this effect when 'selectedUser' changes
  

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

    fetchUsers(); 
  }, []); 

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (newMessage.trim() === "") return;
  
    // Check if there's a user object and it has a displayName
    if (auth.currentUser && auth.currentUser.displayName && selectedUser) {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        sender: auth.currentUser.displayName,
        receiver: selectedUser.username,
      });
    } else {
      // Handle the case where the user is not authenticated or doesn't have a displayName
      console.error("User is not authenticated or doesn't have a displayName");
      // You can add further logic here, such as redirecting to a login page
    }
  
    setNewMessage("");
  };
  
  
  
  


  const handleStartChat = (user) => {
    setSelectedUser(user); 
    localStorage.setItem("selectedUser", JSON.stringify(user)); 
  };

 
  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {selectedUser ? selectedUser.username : ""}</h1>
      </div>
      {!selectedUser ? (
   
        <div>
          <SearchBar handleStartChat={handleStartChat} users={users} />
          <div className="user-list">
                    {users.map((user) => (
            <div
              key={user.id} // Add a unique key prop here
              onClick={() => handleStartChat(user)}
            >
              {user.username}
            </div>
          ))}

          </div>
        </div>
      ) : (

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
