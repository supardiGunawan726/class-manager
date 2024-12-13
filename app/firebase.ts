// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS1UQNkSXikvjTt0YN6k3ZSXAzrKVx03E",
  authDomain: "class-manager-ti22a3.firebaseapp.com",
  projectId: "class-manager-ti22a3",
  storageBucket: "class-manager-ti22a3.firebasestorage.app",
  messagingSenderId: "771669595679",
  appId: "1:771669595679:web:e34d201a6bfe227532672a",
  measurementId: "G-X57DRZ1RCW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
