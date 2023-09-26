import React, { useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const SignOut = ({ isUserSignedIn, userName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const signUserOut = async () => {
      try {
        await signOut(auth);

        if (userName) {
          // Fetch the user's profile data before signing out
          const userDocRef = doc(db, 'users', userName);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData) {
              // Access and use the profile data as needed
              const { title, description, field, profilePic } = userData;
              console.log("User profile data:", { title, description, field, profilePic });
            }
          }

          // Update the user's status
          await updateDoc(userDocRef, {
            online: "Last seen at " + new Date().toLocaleString('en-US', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
          });
        }

        localStorage.clear(); // Clear all user data from localStorage
        navigate('/');
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    if (isUserSignedIn) {
      signUserOut();
    }
  }, [isUserSignedIn, userName, navigate]);

  if (!isUserSignedIn) {
    return null; // If the user is not signed in, don't render the SignOut component
  }

  return (
    <div className="App">
      <div className="app-header">
        {/* You can add header content here if needed */}
      </div>
      <div className="sign-out">
        {/* The sign-out process is handled in the useEffect */}
      </div>
    </div>
  );
};
