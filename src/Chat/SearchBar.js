import React, { useState } from "react";
import { db } from "../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";

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
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Email or Username"
      />
      <button onClick={handleSearch}>Search</button>
      {data && <div>{data}</div>}
    </div>
  );
}
