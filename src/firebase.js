// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1KtykucboQ7H2hp6IBj1YpsUdOF43mNI",
  authDomain: "hide-and-speek-61530.firebaseapp.com",
  projectId: "hide-and-speek-61530",
  storageBucket: "hide-and-speek-61530.appspot.com",
  messagingSenderId: "33995389903",
  appId: "1:33995389903:web:b15610eb0b6b59307070ba",
  measurementId: "G-S51Y1EQVN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider= new GoogleAuthProvider()
export const db= getFirestore(app)




