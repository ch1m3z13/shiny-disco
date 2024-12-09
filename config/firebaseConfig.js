// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpuLxdwLZgBy_ydyRCkaZtOuMc02_R8mQ",
  authDomain: "along-3b219.firebaseapp.com",
  projectId: "along-3b219",
  storageBucket: "along-3b219.appspot.com",
  messagingSenderId: "14138945150",
  appId: "1:14138945150:web:3bcca7b4d61f3556e9722f",
  measurementId: "G-TGYMJQ2RLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;