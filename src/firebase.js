// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider  ,signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0fngCWDha72lX8bLg3V7hmbqMiwJd1rA",
    authDomain: "hide-and-speek-a53e7.firebaseapp.com",
    projectId: "hide-and-speek-a53e7",
    storageBucket: "hide-and-speek-a53e7.appspot.com",
    messagingSenderId: "1027763520347",
    appId: "1:1027763520347:web:26a3f1525224b8f2ba507e",
    measurementId: "G-P5FGK4CQEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider= new GoogleAuthProvider()




