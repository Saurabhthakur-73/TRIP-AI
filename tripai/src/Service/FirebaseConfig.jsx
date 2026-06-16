// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlfd8FGsKwHghjqKCChz3JOwVjmS9qwHU",
  authDomain: "trip-planner-ai-f53c2.firebaseapp.com",
  projectId: "trip-planner-ai-f53c2",
  storageBucket: "trip-planner-ai-f53c2.firebasestorage.app",
  messagingSenderId: "565107463488",
  appId: "1:565107463488:web:d5709e50889f5535ccd6a5",
  measurementId: "G-35TT5XQ0ZW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);