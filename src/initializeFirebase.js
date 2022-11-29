import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZB8e0JtcIqy1qCnURoK2NytAhK0WEpj8",
  authDomain: "project-2886272027144396023.firebaseapp.com",
  projectId: "project-2886272027144396023",
  storageBucket: "project-2886272027144396023.appspot.com",
  messagingSenderId: "407300288526",
  appId: "1:407300288526:web:9b80604aaec6e334388c5f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
