// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// For now, we use placeholders.
// The user will need to add their own keys or we'll add them if provided.
const firebaseConfig = {
  apiKey: "AIzaSyChBZBZLFeyPNrcCdlH-EOAfuyFE5HcBVI",
  authDomain: "lostfound-2e686.firebaseapp.com",
  projectId: "lostfound-2e686",
  storageBucket: "lostfound-2e686.firebasestorage.app",
  messagingSenderId: "388290666720",
  appId: "1:388290666720:web:ac9e4581d3cdca05deb085",
  measurementId: "G-X1GMNSTR8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
