import "./App.css";
import LandingPage from "./LandingPage/LandingPage";
import Home from "./Home/Home";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, createContext } from "react";
import { db, storage } from "../../initializeFirebase";
import { ref, getDownloadURL } from "firebase/storage";

export const currentUserContext = createContext(undefined);

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  const getUserProfileImage = async (userId) => {
    // const url = await getDownloadURL(ref(storage, `usersProfileImage/${userId}`));
    // return url;

    getDownloadURL(ref(storage, `usersProfileImage/${userId}`))
      .then((url) => {
        return url;
      })
      .catch((error) => {
        return undefined;
      });
  };

  const setObserverForAuth = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { email, uid } = user;

        const userProfileImage = await getUserProfileImage(uid);

        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          const { plants, username } = doc.data();

          const sortedPlants = plants.sort((a, b) => a.lastWatering - b.lastWatering);

          setCurrentUser({
            id: uid,
            email: email,
            username: username,
            plants: sortedPlants,
            profileImage: userProfileImage,
          });
        });
      } else {
      }
    });
  };

  useEffect(() => {
    setObserverForAuth();
  }, []);

  return (
    <currentUserContext.Provider value={currentUser}>
      <div className="app">{currentUser !== undefined ? <Home setCurrentUser={setCurrentUser}></Home> : <LandingPage></LandingPage>}</div>
    </currentUserContext.Provider>
  );
};

export default App;
