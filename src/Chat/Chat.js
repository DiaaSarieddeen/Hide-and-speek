import React from "react";

export const Chat = () => (
  <div>
    <h1>{localStorage.getItem("name")}</h1>
    <h1>{localStorage.getItem("email")}</h1>
    <img src={localStorage.getItem("profilePic")} />
  </div>
);