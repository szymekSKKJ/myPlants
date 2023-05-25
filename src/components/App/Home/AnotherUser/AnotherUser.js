import "./AnotherUser.css";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../../../../initializeFirebase";
import { ref, getDownloadURL } from "firebase/storage";

const getUser = async (setUser, givenUserIdInUrl) => {
  const docRef = doc(db, "users", givenUserIdInUrl);
  const docSnapUser = await getDoc(docRef);

  if (docSnapUser.exists()) {
    const { plants } = docSnapUser.data();

    delete docSnapUser.data().plants;

    plants.forEach(async (plant) => {
      const { id: plantId } = plant;

      const docRef = doc(db, "plants", plantId);
      const docSnapPlant = await getDoc(docRef);

      getDownloadURL(ref(storage, `plantImages/${plantId}.png`)).then((url) => {
        setUser((currentValue) => {
          return {
            ...docSnapUser.data(),
            plants: [{ ...docSnapPlant.data(), url: url }],
          };
        });
      });
    });
  } else {
    setUser(null);
  }
};

const AnotherUser = ({ givenUserIdInUrl }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(setUser, givenUserIdInUrl);
  }, [givenUserIdInUrl]);

  useEffect(() => {
    window.history.pushState(null, "", `/?user=${givenUserIdInUrl}`);
  }, []);

  return (
    <div className="another-user">
      {user ? (
        <>
          <h1>Witaj na profilu użytkownika {user.username}</h1>
          <div className="collection">
            {user.plants.map((plant) => {
              const { url, polishName, id } = plant;

              return (
                <div className="plant" key={id}>
                  <div className="image">
                    <img src={url}></img>
                  </div>
                  <p className="name">{polishName}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <h1>Upsss... Wygląda na to, że podany użytkownik nie istnieje</h1>
      )}
    </div>
  );
};

export default AnotherUser;
