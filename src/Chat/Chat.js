import React from "react";
import { ReactDOM } from "react";
import { signInWithGoogle } from "../Authentication/SignIn";

export const Chat=(<div>
  <h1>{localStorage.getItem("name")}</h1>
  <h1>{localStorage.getItem("email")}</h1>
  <img src={localStorage.getItem("profilePic")} />
</div>)