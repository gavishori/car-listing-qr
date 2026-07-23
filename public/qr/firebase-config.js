// Dedicated Firebase project for this tool ONLY — completely separate from
// any other project (e.g. FLYMILY).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0KFLFvnmWnSO-5E-i9LEaxzMxppAbBjc",
  authDomain: "car-qr-counter.firebaseapp.com",
  projectId: "car-qr-counter",
  storageBucket: "car-qr-counter.firebasestorage.app",
  messagingSenderId: "281955609872",
  appId: "1:281955609872:web:77414d20e99bb49f9c8995"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
