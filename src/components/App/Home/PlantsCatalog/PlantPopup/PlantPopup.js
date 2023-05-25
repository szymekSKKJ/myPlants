import "./plant-popup.css";
import { currentUserContext } from "../../../App";
import { useContext, useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, getDocs, getDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../../../../initializeFirebase";
import createNotification from "../../../../../customJS/createNotification";
import defaultUserImage from "../../../../../assets/default_user.png";
import { UserInUrlContext } from "../../Home";

const getPlantComments = async (setPlantComments, currentOpenedPlant) => {
  const { id: plantId } = currentOpenedPlant;

  const querySnapshot = await getDocs(collection(db, "plants", plantId, "comments"));

  querySnapshot.forEach(async (docObject) => {
    const { userId, comment, date } = docObject.data();

    const docSnap = await getDoc(doc(db, "users", userId));

    const { username } = docSnap.data();

    const storage = getStorage();

    try {
      const url = await getDownloadURL(ref(storage, `usersProfileImages/${userId}`));

      setPlantComments((currentValues) => [
        {
          id: docObject.id,
          userId: userId,
          comment: comment,
          username: username,
          imageUrl: url,
          date: new Date(date.seconds * 1000),
        },
        ...currentValues,
      ]);
    } catch {
      setPlantComments((currentValues) => [
        {
          id: docObject.id,
          comment: comment,
          username: username,
          imageUrl: defaultUserImage,
          date: new Date(date.seconds * 1000),
        },
        ...currentValues,
      ]);
    }
  });
};

const addComment = async (currentUser, currentOpenedPlant, textarea, setPlantComments) => {
  const { id: plantId } = currentOpenedPlant;
  const { id: userId, username, profileImage } = currentUser;
  const textareaValue = textarea.value;

  await addDoc(collection(db, "plants", plantId, "comments"), {
    userId: userId,
    comment: textareaValue,
    date: serverTimestamp(),
  });

  setPlantComments((currentValues) => {
    textarea.value = "";

    return [
      {
        comment: textareaValue,
        username: username,
        imageUrl: profileImage,
        date: new Date(),
      },
      ...currentValues,
    ];
  });

  createNotification("Komentarz został dodany", true);
};

const PlantPopup = ({ currentOpenedPlant, setCurrentOpenedPlant }) => {
  const currentUser = useContext(currentUserContext);
  const setGivenUserIdInUrl = useContext(UserInUrlContext);
  const currentUserPlant = currentUser.plants.find((plantLocal) => plantLocal.id === currentOpenedPlant.id);
  const [plantComments, setPlantComments] = useState([]);

  plantComments.sort((a, b) => b.date.getTime() - a.date.getTime());

  const addOrRemovePlantFromCollection = async () => {
    if (currentUserPlant === undefined) {
      await updateDoc(doc(db, "users", currentUser.id), {
        plants: arrayUnion({
          id: currentOpenedPlant.id,
          lastWatering: new Date(),
        }),
      });
    } else {
      await updateDoc(doc(db, "users", currentUser.id), {
        plants: arrayRemove({
          id: currentOpenedPlant.id,
          lastWatering: currentUserPlant.lastWatering,
        }),
      });
    }
  };

  useEffect(() => {
    getPlantComments(setPlantComments, currentOpenedPlant);
  }, []);

  return (
    <div
      className="plant-popup"
      onClick={() => {
        setCurrentOpenedPlant(undefined);
      }}>
      <div className="content" onClick={(event) => event.stopPropagation()}>
        <div className="content-header">
          <button className="main-button" onClick={() => addOrRemovePlantFromCollection()}>
            {currentUserPlant === undefined ? "Dodaj do kolekcji" : "Usuń z kolekcji"}
          </button>
          <h1>{currentOpenedPlant.polishName}</h1>
          <h2>{currentOpenedPlant.latinName}</h2>
        </div>
        <div className="image-and-description-wrapper">
          <img src={currentOpenedPlant.url}></img>
          <p className="description">
            {currentOpenedPlant.description} <span>Podlewanie co {currentOpenedPlant.wateringOncePerDays} dni</span>.
          </p>
        </div>
        <div className="users-comments">
          <h2>Zobacz co użytkownicy sądzą o tej roślinie</h2>
          <div className="user-comment">
            <div className="image">
              <img src={currentUser.profileImage}></img>
            </div>
            <div className="wrapper">
              <div className="username">
                <p>{currentUser.username}</p>
              </div>
              <div className="comment">
                <textarea placeholder="Dodaj komentarz..."></textarea>
                <button
                  className="main-button"
                  onClick={(event) => addComment(currentUser, currentOpenedPlant, event.currentTarget.parentElement.firstChild, setPlantComments)}>
                  Dodaj
                </button>
              </div>
            </div>
          </div>
          {plantComments.length !== 0 &&
            plantComments.map((commentObject) => {
              const { username, comment, imageUrl, userId, id } = commentObject;

              return (
                <div className="user-comment" key={id}>
                  <div className="image" onClick={() => setGivenUserIdInUrl(userId)}>
                    <img src={imageUrl}></img>
                  </div>
                  <div className="wrapper">
                    <div className="username">
                      <p>{username}</p>
                    </div>
                    <div className="comment">
                      <p>{comment}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PlantPopup;
