import React from "react";
import { SearchBar } from "./SearchBar";
import { Homepage } from "./Homepage";
import { Profile } from "./Profile";
import './Chat.css'

export const Chat = () => (
  <div className="chat-container">
    <div className="profile-container">
      <Profile />
    </div>
    <div className="homepage-container">
      <Homepage />
    </div>
  </div>
);

/*
 <h1>{localStorage.getItem("name")}</h1>
    <h1>{localStorage.getItem("email")}</h1>
    <img src={localStorage.getItem("profilePic")} />
*/
