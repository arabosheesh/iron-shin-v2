import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYSY4fXrGfSYhbJoDQgJv9XhBfCPMZAvg",
  authDomain: "ironshingym.firebaseapp.com",
  databaseURL: "https://ironshingym-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ironshingym",
  storageBucket: "ironshingym.firebasestorage.app",
  messagingSenderId: "760722854456",
  appId: "1:760722854456:web:c1b8a29b80623f63444ccd",
  measurementId: "G-VCD96VJ5S5"
};

const app = initializeApp(firebaseConfig);

// These two lines are the "Keys" to your gym's data
export const auth = getAuth(app);
export const db = getFirestore(app);