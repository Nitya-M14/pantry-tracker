// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUlyTl8Ksnlh3EBnj1j5rTriJ7ULng2Qc",
  authDomain: "pantry-tracker-83e91.firebaseapp.com",
  projectId: "pantry-tracker-83e91",
  storageBucket: "pantry-tracker-83e91.appspot.com",
  messagingSenderId: "651127129966",
  appId: "1:651127129966:web:3aa840847c51e16cf3637f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);