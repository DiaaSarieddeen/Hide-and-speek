// Homepage.js
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
import { TextField, InputAdornment, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import './SearchBar.css'

export const Homepage = () => {
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem("selectedUser"))); 
  const [users, setUsers] = useState([])

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (!selectedUser) return;

    if (auth.currentUser && auth.currentUser.displayName) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          where("sender", "in", [auth.currentUser.displayName, selectedUser?.username]),
          where("receiver", "in", [auth.currentUser.displayName, selectedUser?.username]),
          orderBy("createdAt")
        ),
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesData);
        }
      );

      return () => unsubscribe();
    }
  },[selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    if (auth.currentUser && auth.currentUser.displayName && selectedUser) {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        sender: auth.currentUser.displayName,
        receiver: selectedUser.username,
      });
    } else {
      console.error("User is not authenticated or doesn't have a displayName");
    }

    setNewMessage("");
  };

  const handleStartChat = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    <div className="chat-app">
      <div className="sidebar">
        <SearchBar handleStartChat={handleStartChat} users={users} />
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              onClick={() => handleStartChat(user)}
              alignItems="flex-start"
              button
            >
              <ListItemAvatar>
                <Avatar alt={user.username} src={user.profilePic} />
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment><Typography sx={{ fontFamily: 'Rubik' }}>{user.username}</Typography></React.Fragment>}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline', fontFamily: 'Rubik' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.title}
                    </Typography>
                    <Typography
                      sx={{ display: 'flex', justifyContent: "left", fontStyle: "italic", fontFamily: 'Rubik' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.status}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div className="chat-container">
        <div className="header">
          {selectedUser ? (
            <>
              <div className="Username">
                <Avatar alt={selectedUser.username} src={selectedUser.profilePic} style={{ marginTop: '1.3rem',marginRight:"1rem" }} />
                <h1>{selectedUser.username}</h1>
              </div>
              <div className="Status">
                <h3 style={{ marginRight: "20xp", color: selectedUser.status === 'Online' ? "#6BCB77" : "#7D7C7C" }}>{selectedUser.status}</h3>
              </div>
            </>
          ) : (
            <h1>Welcome to Hide&Speek</h1>
          )}
        </div>
        {!selectedUser ? (
          <div className="empty-chat">Select a user to start a chat</div>
        ) : (
          <div className="ChatTab">
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                id="Search"
                label="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SendIcon sx={{ marginBottom: '12px', width: "2rem", height: "2rem" }} />
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
    </div>
  );
};
