import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore"
import {getStorage} from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication
import {getMessaging, getToken} from 'firebase/messaging'

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
const messaging = getMessaging(app);

export {storage, db,app ,auth, messaging};

export const generateToken = async () => {

  const permission = await Notification.requestPermission();

  console.log("permision is ",permission)

  if (permission === "granted"){
    const token = await getToken(messaging, {
      vapidKey: "BLZQb9jKDmmIuw8FWtCx9iCfeL8UU8dteoLAK7AqISIEQ_3N8OgyAqFIYO56lgX3V3YxzzmDXrbN6SefWZZ-leg"
    })
    console.log("Token is :" ,token)
  }

}
