// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw5vMC7EewXzn3cDISSx9zV8JmRs8uSvw",
  authDomain: "hide-and-speek-c96b5.firebaseapp.com",
  projectId: "hide-and-speek-c96b5",
  storageBucket: "hide-and-speek-c96b5.appspot.com",
  messagingSenderId: "378233514467",
  appId: "1:378233514467:web:767c671d82a23a831898d6",
  measurementId: "G-L9PENL791J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider= new GoogleAuthProvider()




