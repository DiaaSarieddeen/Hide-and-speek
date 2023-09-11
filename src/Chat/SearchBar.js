import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { query, where, getDocs, collection } from "firebase/firestore";

export function SearchBar({ handleStartChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;

    // Create a query that filters documents based on their email or username field
    const emailQuery = query(collection(db, "users"), where("email", "==", searchTerm));
    const usernameQuery = query(collection(db, "users"), where("username", "==", searchTerm));

    // Get the query results
    const querySnapshotEmail = await getDocs(emailQuery);
    const querySnapshotUsername = await getDocs(usernameQuery);

    if (!querySnapshotEmail.empty) {
      // If there are any results, update the state with the data
      const userData = querySnapshotEmail.docs.map((doc) => doc.data())[0];
      handleStartChat(userData); // Start a chat with the selected user
      localStorage.setItem("name", userData.username);
    } else if (!querySnapshotUsername.empty) {
      // If the username matches, you can handle it similarly
      // ...
    } else {
      // If there are no results, display an error message
      setData("No results found!");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Email"
      />
      <button onClick={handleSearch}>Search</button>
      {data && <div>{data}</div>}
    </div>
  );
}

