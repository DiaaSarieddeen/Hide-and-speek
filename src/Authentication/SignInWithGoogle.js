import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const signInWithGoogle = (navigate) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      localStorage.setItem('profilePic', profilePic);
      
      navigate("/chat"); // Redirect to "/Chat" page
    })
    .catch((error) => {
      console.log(error);
    });
};
