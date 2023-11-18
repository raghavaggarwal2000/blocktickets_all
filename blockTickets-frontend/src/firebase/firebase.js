// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhtrrnxXqxJ_5nCx2L9Rr-Lacldujd26I",
  authDomain: "blocktickets-86cb4.firebaseapp.com",
  projectId: "blocktickets-86cb4",
  storageBucket: "blocktickets-86cb4.appspot.com",
  messagingSenderId: "811270255451",
  appId: "1:811270255451:web:afac4f54b33505af2da07e",
  measurementId: "G-918Z4BQGCH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
const analytics = getAnalytics(app);

export {app,auth, googleProvider,fbProvider,analytics};