// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGbKwv_46MrOIzf0GXqIZ6Bigb7sU9sGk",
  authDomain: "wartaubaya-58436.firebaseapp.com",
  projectId: "wartaubaya-58436",
  storageBucket: "wartaubaya-58436.appspot.com",
  messagingSenderId: "768394622528",
  appId: "1:768394622528:web:f247e22bdf395b804491a5",
  measurementId: "G-N8LP8VPL6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);