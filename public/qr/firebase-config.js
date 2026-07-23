// Dedicated Firebase project for this tool ONLY — completely separate from
// any other project (e.g. FLYMILY). Do not point this at another project's
// Firebase config. Fill these values in after creating a fresh project
// (see README.md, step "Create the Firebase project").
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
