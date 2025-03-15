// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiLxZjQvl6GlwSOzN9tHGMgn8Yrr23zaw",
  authDomain: "order-cb2c9.firebaseapp.com",
  projectId: "order-cb2c9",
  storageBucket: "order-cb2c9.firebasestorage.app",
  messagingSenderId: "1069543438048",
  appId: "1:1069543438048:web:c93a88adbc3e02f85dc285",
  measurementId: "G-WRRN062EBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };