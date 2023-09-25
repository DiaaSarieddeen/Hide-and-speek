import { auth, provider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore"; 

export const signInWithGoogle = (navigate) => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
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
          online: true,
          profilePic:profilePic
        });
      }

      navigate("/chat"); // Redirect to "/Chat" page
    })
    .catch((error) => {
      console.log(error);
    });
};
