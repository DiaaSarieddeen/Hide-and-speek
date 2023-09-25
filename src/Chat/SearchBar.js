import React, { useState } from "react";
import { db } from "../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
import "./SearchBar.css"
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ManageSearch, Margin } from "@mui/icons-material";
import { Button } from "@mui/material";

export function SearchBar({ handleStartChat, users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);

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

  return (
    <div>
     <TextField
     fullWidth
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search by Email or Username"
  id="Search"
  label="Search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <ManageSearch sx={{marginBottom:'12px',width:"2rem",height:"2rem"}} />
      </InputAdornment>
    ),
  }}
  variant="standard"
/>
      <Button onClick={handleSearch} id="srh_button">Search</Button>
      {data && <div>{data}</div>}
    </div>
  );
}
