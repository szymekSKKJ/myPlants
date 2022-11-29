import "./plant-popup.css";
import { currentUserContext } from "../../../App";
import { useContext } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../../../../initializeFirebase";

const PlantPopup = ({ currentOpenedPlant, setCurrentOpenedPlant }) => {
  const currentUser = useContext(currentUserContext);
  const currentUserPlant = currentUser.plants.find((plantLocal) => plantLocal.id === currentOpenedPlant.id);

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

  return (
    <div
      className="plant-popup"
      onClick={() => {
        setCurrentOpenedPlant(undefined);
      }}>
      <div className="content" onClick={(event) => event.stopPropagation()}>
        <button className="main-button" onClick={() => addOrRemovePlantFromCollection()}>
          {currentUserPlant === undefined ? "Dodaj do kolekcji" : "Usuń z kolekcji"}
        </button>
        <h1>{currentOpenedPlant.polishName}</h1>
        <h2>{currentOpenedPlant.latinName}</h2>
        <div className="image-and-description-wrapper">
          <img src={currentOpenedPlant.url}></img>
          <p className="description">
            {currentOpenedPlant.description} <span>Podlewanie co {currentOpenedPlant.wateringOncePerDays} dni</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlantPopup;
