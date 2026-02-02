// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwZi4LInPNCaYo7zouKJCycjuZ9YHpqr4",
  authDomain: "planet-ab1f7.firebaseapp.com",
  projectId: "planet-ab1f7",
  storageBucket: "planet-ab1f7.firebasestorage.app",
  messagingSenderId: "704128477215",
  appId: "1:704128477215:web:7b93f60532562d4d0d0d2a"
};

// ✅ MUST be called before Firestore
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore ONLY after app init
export const db = getFirestore(app);
