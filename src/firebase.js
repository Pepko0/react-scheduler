import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbyu0MMZWin4kgX6GAjxTrWrggrA8Gp6Q",
  authDomain: "reactscheduler-fd75b.firebaseapp.com",
  projectId: "reactscheduler-fd75b",
  storageBucket: "reactscheduler-fd75b.firebasestorage.app",
  messagingSenderId: "961780253476",
  appId: "1:961780253476:web:e6f2b070969bec428629b1",
  measurementId: "G-2LTHS0QM1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };


