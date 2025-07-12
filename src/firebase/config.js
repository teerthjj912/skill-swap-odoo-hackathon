import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Tot39RqgA8hAz5TZYUIM4k2juAaqRlQ",
  authDomain: "skill-swap-odoo.firebaseapp.com",
  databaseURL: "https://skill-swap-odoo-default-rtdb.firebaseio.com",
  projectId: "skill-swap-odoo",
  storageBucket: "skill-swap-odoo.firebasestorage.app",
  messagingSenderId: "798308402796",
  appId: "1:798308402796:web:518ec681bb43aa73a2fa49",
  measurementId: "G-RZVSYVH3FG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export { addDoc };

export default app; 