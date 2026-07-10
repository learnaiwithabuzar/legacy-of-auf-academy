import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMFjkgjvZXPZewbkDIyVBxN50DXF7yK4Y",
  authDomain: "legacy-of-auf-academy.firebaseapp.com",
  projectId: "legacy-of-auf-academy",
  storageBucket: "legacy-of-auf-academy.firebasestorage.app",
  messagingSenderId: "593959145549",
  appId: "1:593959145549:web:94f847610b931b24bd0c04",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
