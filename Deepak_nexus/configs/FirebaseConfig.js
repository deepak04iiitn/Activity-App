// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrFIDjLfU21PepbF1DoSbtX4QQxlQ4GN4",
  authDomain: "activity-centre-1f780.firebaseapp.com",
  projectId: "activity-centre-1f780",
  storageBucket: "activity-centre-1f780.appspot.com",
  messagingSenderId: "790837940057",
  appId: "1:790837940057:web:b11935d0b574725c79c648"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
