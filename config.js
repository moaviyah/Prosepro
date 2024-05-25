// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4yn_ZzknOoJJhQhSrrurIrS4eyITUPes",
  authDomain: "books-282b6.firebaseapp.com",
  databaseURL: "https://books-282b6-default-rtdb.firebaseio.com",
  projectId: "books-282b6",
  storageBucket: "books-282b6.appspot.com",
  messagingSenderId: "185392075557",
  appId: "1:185392075557:web:38fb7196064847301a00cc",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app