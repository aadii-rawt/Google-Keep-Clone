import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCClq47In9bEQfPL1q0AgD0toq5-5RYgBE",
  authDomain: "note-app-1d443.firebaseapp.com",
  projectId: "note-app-1d443",
  storageBucket: "note-app-1d443.appspot.com",
  messagingSenderId: "673029405739",
  appId: "1:673029405739:web:4b333bedc2396b77aa3e6e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const imgDb = getStorage(app);
export const auth = getAuth(app);