import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHCsRxKFIukTdzzixlCda74VSVZyILcIc",
  authDomain: "my-web-70b4a.firebaseapp.com",
  projectId: "my-web-70b4a",
  storageBucket: "my-web-70b4a.firebasestorage.app",
  messagingSenderId: "884988681726",
  appId: "1:884988681726:web:db322ec35f85bac6c1b4af",
  measurementId: "G-K1E3TDCP1V",
  databaseURL: "https://my-web-70b4a-default-rtdb.asia-southeast1.firebasedatabase.app/"  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);