import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKLNmvsu9aFnxm313oUtA_tjT5QtAJR1Q",
  authDomain: "control-salud-cab8b.firebaseapp.com",
  projectId: "control-salud-cab8b",
  storageBucket: "control-salud-cab8b.firebasestorage.app",
  messagingSenderId: "282094256410",
  appId: "1:282094256410:web:9668291cd5d9178367aca3",
  measurementId: "G-RY3Q8R4GHM",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
