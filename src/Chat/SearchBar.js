import React, { useState } from "react";
import { db } from "../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
import "./SearchBar.css"
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ManageSearch, Margin } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

export function SearchBar({ handleStartChat}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([])

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;

    const emailQuery = query(collection(db, "users"), where("email", "==", searchTerm));
    const usernameQuery = query(collection(db, "users"), where("username", "==", searchTerm));

    try {
      const [emailResults, usernameResults] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
      ]);

      let selectedUser = null;

      if (!emailResults.empty) {
        selectedUser = emailResults.docs[0].data();
      } else if (!usernameResults.empty) {
        selectedUser = usernameResults.docs[0].data();
      } else {
        setData("No results found!");
      }

      if (selectedUser) {
        handleStartChat(selectedUser);
        localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

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

  
  return (
    <div className="sidebar">
     <TextField
     fullWidth
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search by Email or Username"
  id="Search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <ManageSearch sx={{marginBottom:'12px',width:"2rem",height:"2rem",color:"white"}} />
      </InputAdornment>
    ),
  }}
  variant="standard"
/>
      <Button onClick={handleSearch} id="srh_button">Search</Button>
      {data && <div>{data}</div>}
      <List sx={{ width: '100%', maxWidth: 360,backgroundColor:"#000ec8",borderRadius:"10px"}}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              onClick={() => handleStartChat(user)}
              alignItems="flex-start"
              button
              sx={{borderBottom:"1px solid #9aa7f4", backgroundColor:"#000ec8 !important"}}
            >
              <ListItemAvatar>
                <Avatar alt={user.username} src={user.profilePic} />
              </ListItemAvatar>
              <ListItemText
                primary={<React.Fragment><Typography sx={{ fontFamily: 'Rubik',color:"white" }}>{user.username}</Typography></React.Fragment>}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline', fontFamily: 'Rubik' ,color:"#68f6fb"}}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.title}
                    </Typography>
                    <Typography
                      sx={{ display: 'flex', justifyContent: "left", fontStyle: "italic", fontFamily: 'Rubik',color: user.status === 'Online' ? "#00ee71" : "#eaeaea"}}
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
  );
}
