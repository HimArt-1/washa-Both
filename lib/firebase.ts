import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDLIyWIn-46jmklCO7CfKShfjA_Ek7qFf4",
  authDomain: "washa-5b4b7.firebaseapp.com",
  projectId: "washa-5b4b7",
  storageBucket: "washa-5b4b7.firebasestorage.app",
  messagingSenderId: "1072781045349",
  appId: "1:1072781045349:web:45e52aff8bae7f49fea08c",
  measurementId: "G-M7DLT2PLWE"
};

// Initialize Firebase securely (prevents re-initialization error in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
