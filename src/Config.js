import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore"
import {getStorage} from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication


const firebaseConfig = {
  apiKey: "AIzaSyBvqUHysbjYNn3nAg8pNhD8eA0LmbSOlX0",
  authDomain: "bus-driver-navigation.firebaseapp.com",
  databaseURL: "https://bus-driver-navigation-default-rtdb.firebaseio.com",
  projectId: "bus-driver-navigation",
  storageBucket: "bus-driver-navigation.appspot.com",
  messagingSenderId: "649443007271",
  appId: "1:649443007271:web:edfa5fc2853891f63fe702",
  measurementId: "G-HGBFY01SR1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Authentication


export {storage, db,app ,auth};
