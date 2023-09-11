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

     // Check if a document with ID 'uid' already exists in collection "users"
     const docRef = doc(db, "users", result.user.uid);
     const docSnap = await getDoc(docRef);

     if (!docSnap.exists()) {
       // Add a new document in collection "users" with ID 'uid'
       await setDoc(docRef, {
         username: name,
         email: email,
         online:true
       });
     }

      navigate("/chat"); // Redirect to "/Chat" page
    })
    .catch((error) => {
      console.log(error);
    });
};
