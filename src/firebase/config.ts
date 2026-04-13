import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCKB2E6p6bbIVoav8q6sMhyLG5oqKaw_OU",
  authDomain: "acadifyx-website-21ad7.firebaseapp.com",
  projectId: "acadifyx-website-21ad7",
  storageBucket: "acadifyx-website-21ad7.firebasestorage.app",
  messagingSenderId: "1029890875042",
  appId: "1:1029890875042:web:d7b1a11da93ad174e4c1fb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);