import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCx-QfMxWkxNhIVcrsR7fb8B2l3wCN4HXU",
  authDomain: "blogadminpanel.firebaseapp.com",
  projectId: "blogadminpanel",
  storageBucket: "blogadminpanel.appspot.com",
  messagingSenderId: "133829418101",
  appId: "1:133829418101:web:291cb65212a7b1f714ec3c",
  measurementId: "G-ET3LP0EM1Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;