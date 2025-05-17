import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMTsfm2mMuDXrN1dskwQkO3lV9ThdSV_I",
  authDomain: "ot-app-a6736.firebaseapp.com",
  projectId: "ot-app-a6736",
  storageBucket: "ot-app-a6736.firebasestorage.app",
  messagingSenderId: "369809607498",
  appId: "1:369809607498:web:9ae94451113c48afd80fb3",
  measurementId: "G-KDFG8ENLB8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);