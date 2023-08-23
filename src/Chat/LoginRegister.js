import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../Authentication/SignInWithGoogle';
import SignIn from '../Authentication/SignIn';
import SignUp from '../Registration/SignUp';
export function LoginRegisterGoogle() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInWithGoogle(navigate);
  };

  return (
    <button onClick={handleSignIn}>
      Sign In with Google
    </button>
  );
}
export function Register() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    SignUp(navigate);
  };

  return (
    <button onClick={handleSignIn}>
      Sign In with Google
    </button>
  );
}

