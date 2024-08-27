import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCY0TZxOmqYLffh25aAkuM9873zeRys5_w",
  authDomain: "sampleapp-6f822.firebaseapp.com",
  projectId: "sampleapp-6f822",
  storageBucket: "sampleapp-6f822.appspot.com",
  messagingSenderId: "97307136462",
  appId: "1:97307136462:web:99cd04fb9bcd423aa19b9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
