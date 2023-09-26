
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
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { TextField,InputAdornment,Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import './SearchBar.css'

export const Homepage = () => {

  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("selectedUser"))); 
  const [users,setUsers]=useState([])

 
  const messagesRef = collection(db, "messages");

  
  useEffect(() => {
    if (!selectedUser) return; // If no user is selected, do nothing
  
    // Check if auth.currentUser is not null
    if (auth.currentUser && auth.currentUser.displayName) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          // Filter by both sender and receiver
          where("sender", "in", [auth.currentUser.displayName, selectedUser?.username]),
          where("receiver", "in", [auth.currentUser.displayName, selectedUser?.username]),
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
      <div className="header" style={{display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
}}>
      {selectedUser ? (
        <>
          <Avatar alt={selectedUser.username} src={selectedUser.profilePic} style={{marginTop:'1rem',marginRight:"1rem"}} />  
          <h1>{selectedUser.username}</h1>
          <h3>{selectedUser.status}</h3>
        </>
      ) : (
        <h1>Welcome to Hide&Speek</h1>
      )}
    </div>
      {!selectedUser ? (
   
        <div>
          <SearchBar handleStartChat={handleStartChat} users={users} />
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  {users.map((user) => (
    <ListItem
      key={user.id} // Add a unique key prop here
      onClick={() => handleStartChat(user)}
      alignItems="flex-start"
      button
    >
      <ListItemAvatar>
        <Avatar alt={user.username} src={user.profilePic} />
      </ListItemAvatar>
      <ListItemText
        primary={user.username}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {user.title}
              {user.status}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  ))}
</List>

        </div>
      ) : (

        <div>
          <Button onClick={() => setSelectedUser(null)} id="srh_button">Back</Button>
          <form onSubmit={handleSubmit}>
          <TextField
     fullWidth
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  placeholder="Type your message..."
  id="Search"
  label="Search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="end">
       <SendIcon sx={{marginBottom:'12px',width:"2rem",height:"2rem",}} />
      </InputAdornment>
    ),
  }}
  variant="standard"
/>
            <Button id="srh_button" type="submit">Send</Button>
          </form>
          <div className="messages">
          <List>
  {messages.map((message) => (
    <ListItem key={message.id}>
      <ListItemText
        primary={
          <Typography variant="h6" component="div">
            {message.sender === auth.currentUser.displayName ? 'You' : message.sender}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="textSecondary">
            {message.createdAt && message.createdAt.toDate().toLocaleString('en-US', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})}

            </Typography>
            <Typography variant="body1">
              {message.text}
            </Typography>
          </>
        }
      />
    </ListItem>
  ))}
</List>
</div>
        </div>
      )}
    </div>
  );
};


