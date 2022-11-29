import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiEwJpC4-zBpsu1YWOMthX6YELldIaAQk",
  authDomain: "myplants-1eff7.firebaseapp.com",
  projectId: "myplants-1eff7",
  storageBucket: "myplants-1eff7.appspot.com",
  messagingSenderId: "122529908062",
  appId: "1:122529908062:web:3a74a6daa82717206a3bcf",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
