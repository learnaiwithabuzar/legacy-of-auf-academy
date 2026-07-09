import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "gen-lang-client-0814603400",
  appId: "1:566577117814:web:1153f7267e7264c621fd57",
  apiKey: "AIzaSyBF98C4nLTDxhZ1ib5vm0qLjawNmbSjLqw",
  authDomain: "gen-lang-client-0814603400.firebaseapp.com",
  storageBucket: "gen-lang-client-0814603400.firebasestorage.app",
  messagingSenderId: "566577117814"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

