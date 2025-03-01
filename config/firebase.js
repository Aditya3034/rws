// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup  } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };

const firebaseConfig = {
    apiKey: "AIzaSyC5mQA4KSiVLT6SGzvwAnrIOvC7hhtcxqI",
    authDomain: "ready-work-sheet.firebaseapp.com",
    projectId: "ready-work-sheet",
    storageBucket: "ready-work-sheet.firebasestorage.app",
    messagingSenderId: "173556320240",
    appId: "1:173556320240:web:5666cf00c3ff8642e97f35"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };