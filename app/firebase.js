// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const API_KEY = process.env.apiKey;
const AUTH_DOMAIN = process.env.authDomain;
const STORAGE_BUCKET = process.env.storageBucket;
const MESSAGE_SENDER_ID = process.env.messagingSenderId;
const APP_ID = process.env.appId;

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: "pantry-tracker-83e91",
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID ,
    appId: APP_ID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// Your web app's Firebase configuration

