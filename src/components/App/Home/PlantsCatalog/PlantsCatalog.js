import "./PlantsCatalog.css";
import PlantPopup from "./PlantPopup/PlantPopup";
import { db, storage } from "../../../../initializeFirebase";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { currentUserContext } from "../../App";
import { ref, getDownloadURL } from "firebase/storage";

const PlantsCatalog = () => {
  const [plants, setPlants] = useState([]);
  const [currentOpenedPlant, setCurrentOpenedPlant] = useState(undefined);
  const currentUser = useContext(currentUserContext);

  const getPlants = async () => {
    const plantsLocal = [];

    const querySnapshot = await getDocs(collection(db, "plants"));

    querySnapshot.forEach((doc) => {
      const { polishName, latinName, description, wateringOncePerDays } = doc.data();

      plantsLocal.push({
        id: doc.id,
        polishName: polishName,
        latinName: latinName,
        description: description,
        wateringOncePerDays: wateringOncePerDays,
        url: undefined,
      });
    });

    plantsLocal.forEach((plant, index, array) => {
      getDownloadURL(ref(storage, `plantImages/${plant.id}.png`)).then((url) => {
        array[index].url = url;

        setPlants([...array]);
      });
    });
  };

  const addToMyPlants = async (plant) => {
    const { id } = plant;

    await updateDoc(doc(db, "users", currentUser.id), {
      plants: arrayUnion({
        id: id,
        lastWatering: new Date(),
      }),
    });
    getPlants();
  };

  useEffect(() => {
    getPlants();
  }, []);

  return (
    <>
      {currentOpenedPlant && <PlantPopup currentOpenedPlant={currentOpenedPlant} setCurrentOpenedPlant={setCurrentOpenedPlant}></PlantPopup>}
      <div className="plants-catalog">
        <div className="header">
          <h1>Przeglądaj rośliny</h1>
        </div>
        {plants.length !== 0
          ? plants.map((plant) => {
              const { polishName, description, id, wateringOncePerDays, url } = plant;

              const isThisPlantCurrentUserPlant = currentUser.plants.find((plantLocal) => plantLocal.id === id);
              return (
                <div className="plant">
                  <button
                    className={`add-or-remove-palnt-button ${isThisPlantCurrentUserPlant !== undefined ? "favorite" : ""}`}
                    onClick={() => (isThisPlantCurrentUserPlant === undefined ? addToMyPlants(plant) : null)}>
                    <span className="material-symbols-outlined">{isThisPlantCurrentUserPlant !== undefined ? "favorite" : "add"}</span>
                  </button>
                  <div className="image">
                    <img src={url}></img>
                  </div>
                  <div className="name-and-description-wrapper">
                    <p className="name">{polishName}</p>
                    <p className="description">
                      {description} Podlewanie co {wateringOncePerDays} dni.
                    </p>
                    <button className="main-button" onClick={() => setCurrentOpenedPlant(plant)}>
                      Czytaj dalej
                    </button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default PlantsCatalog;
