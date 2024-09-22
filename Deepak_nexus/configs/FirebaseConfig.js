// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWdF6zqPmNvdzIoEagkTgEqC_ypOAaXD4",
  authDomain: "nexus-df3d0.firebaseapp.com",
  projectId: "nexus-df3d0",
  storageBucket: "nexus-df3d0.appspot.com",
  messagingSenderId: "291552945252",
  appId: "1:291552945252:web:2bde18ce912b5e87a0ab71"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
