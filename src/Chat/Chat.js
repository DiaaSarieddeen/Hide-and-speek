import React, { useState } from "react";
import { Homepage } from "./Homepage";
import { Profile } from "./Profile";
import './Chat.css'

export const Chat = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(true); // Set this based on the user's sign-in status
  const [userName, setUserName] = useState(""); // Add this state to store the user's name

  // Other code...

  return (
    <div className="chat-container">
      <div className="profile-container">
        <Profile />
      </div>
      <div className="homepage-container">
        <Homepage />
      </div>
    </div>
  );
};
