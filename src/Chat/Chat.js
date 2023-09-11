import React from "react";
import { SearchBar } from "./SearchBar";
import { Homepage } from "./Homepage";

export const Chat = () => (
  <div>
    <h1>{localStorage.getItem("name")}</h1>
    <h1>{localStorage.getItem("email")}</h1>
    <img src={localStorage.getItem("profilePic")} />
    <Homepage/>
  </div>
);
