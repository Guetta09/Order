// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiLxZjQvl6GlwSOzN9tHGMgn8Yrr23zaw",
  authDomain: "order-cb2c9.firebaseapp.com",
  projectId: "order-cb2c9",
  storageBucket: "order-cb2c9.appspot.com", // 🔥 Corrección aquí
  messagingSenderId: "1069543438048",
  appId: "1:1069543438048:web:c93a88adbc3e02f85dc285",
  measurementId: "G-WRRN062EBZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
