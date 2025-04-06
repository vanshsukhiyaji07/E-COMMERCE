// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmfd2-pU8zvw29jhGWlVUNiOcEw6YihvY",
  authDomain: "fir-crud-39044.firebaseapp.com",
  projectId: "fir-crud-39044",
  storageBucket: "fir-crud-39044.appspot.com", // Corrected
  messagingSenderId: "1098321260835",
  appId: "1:1098321260835:web:94a269a325139eed551c96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
