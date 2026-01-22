// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCH2RVY-GVlB4ssAYRLabx6ouI0HoxMinE",
  authDomain: "carmaintainence.firebaseapp.com",
  databaseURL: "https://carmaintainence-default-rtdb.firebaseio.com",
  projectId: "carmaintainence",
  storageBucket: "carmaintainence.firebasestorage.app",
  messagingSenderId: "70925614843",
  appId: "1:70925614843:web:c658aeaf3be7fb0c91fa5e",
  measurementId: "G-W17S6DKLZY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
