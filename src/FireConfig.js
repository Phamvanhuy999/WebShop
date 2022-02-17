
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAsJlOlSF9OcXfCkDRdM3uaexaJ3-ZPC7M",
  authDomain: "hl-fashion.firebaseapp.com",
  projectId: "hl-fashion",
  storageBucket: "hl-fashion.appspot.com",
  messagingSenderId: "373302141789",
  appId: "1:373302141789:web:67cb651651cdadbfc03eb4",
  measurementId: "G-WCGZT69QD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firedb = getFirestore(app);
export default firedb;