import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCunu5DTjA-G7t7HfMecsntHm3rIRAe67o",
  authDomain: "gym-7445a.firebaseapp.com",
  projectId: "gym-7445a",
  storageBucket: "gym-7445a.firebasestorage.app",
  messagingSenderId: "375439941271",
  appId: "1:375439941271:web:0044e1128e9f5d7ea553d2",
  measurementId: "G-7NSZ3NJ93W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
