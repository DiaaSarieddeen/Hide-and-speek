import React from "react";
import { SearchBar } from "./SearchBar";
import { Homepage } from "./Homepage";
import {Profile} from "./Profile";

export const Chat = () => (
  <div>
    <Profile/>
    <Homepage/>
  </div>
);
/*
 <h1>{localStorage.getItem("name")}</h1>
    <h1>{localStorage.getItem("email")}</h1>
    <img src={localStorage.getItem("profilePic")} />
*/
