// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZGAwHaXH_ZTjPp5kaTg13BER_NVvNnoo",
  authDomain: "login-auth-429c6.firebaseapp.com",
  projectId: "login-auth-429c6",
  storageBucket: "login-auth-429c6.firebasestorage.app",
  messagingSenderId: "115375743764",
  appId: "1:115375743764:web:c16f0eda777c8456531801",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Authentication
const auth = getAuth(app);

export default auth;
export { analytics, app };