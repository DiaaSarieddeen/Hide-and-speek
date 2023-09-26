import { auth, provider, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Corrected import
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; 

export const signInWithGoogle = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, provider);

    console.log(result);
    const name = result.user.displayName;
    const email = result.user.email;
    const profilePic = result.user.photoURL;

    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('profilePic', profilePic);

    // Create a username-based document ID
    //const username = name.replace(/\s/g, ""); // Remove spaces for the username
    const docRef = doc(db, "users", name);

    // Check if a document with the username already exists in collection "users"
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Add a new document in collection "users" with the username as the document ID
      await setDoc(docRef, {
        username: name,
        email: email,
        status: "Online",
        profilePic: profilePic
      });
    } else {
      await updateDoc(docRef, {
        status: "Online"
      });
    }

    navigate("/chat"); // Redirect to "/Chat" page
  } catch (error) {
    console.log("Error signing in with Google:", error);
  }
};