// =====================
//  Firebase Config
// =====================
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Tu configuración:
const firebaseConfig = {
  apiKey: "AIzaSyBXNl5Lzoy-2magXvwZgTAXGHuxLSGHvGI",
  authDomain: "parma-shop-b49a2.firebaseapp.com",
  projectId: "parma-shop-b49a2",
  databaseURL: "https://parma-shop-b49a2-default-rtdb.firebaseio.com",
  storageBucket: "parma-shop-b49a2.appspot.com",
  messagingSenderId: "658562578372",
  appId: "1:658562578372:web:b813b5b79ae3829fb1d691",
  measurementId: "G-5KVNRMR6K5",
};

// Inicializar
const app = initializeApp(firebaseConfig);

// =====================
// EXPORTS NECESARIOS
// =====================
export const auth = getAuth(app);
export const db = getDatabase(app);      // <-- REALTIME DATABASE
export const storage = getStorage(app);  // <-- STORAGE REAL

export default app;
