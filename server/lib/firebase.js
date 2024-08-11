import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCySIdMuHHAcBGGxIheSi8_fFpJbQLodsI",
  authDomain: "warehouse-system-3b4ea.firebaseapp.com",
  projectId: "warehouse-system-3b4ea",
  storageBucket: "warehouse-system-3b4ea.appspot.com",
  messagingSenderId: "270752310295",
  appId: "1:270752310295:web:8fdad81ccb4f76c0c4e852",
  measurementId: "G-E3B8E4JN40"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
