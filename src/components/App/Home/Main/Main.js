import "./Main.css";
import { useContext, useEffect, useState } from "react";
import { currentUserContext } from "../../App";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../../../initializeFirebase";
import { ref, getDownloadURL } from "firebase/storage";

const Main = ({ sidebarRef }) => {
  const currentUser = useContext(currentUserContext);
  const [plants, setPlants] = useState([]);
  const [plantsToWatering, setPlantsToWatering] = useState([]);

  const toDateTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date;
  };

  const findPlantsToWatering = (plants) => {
    const plantsToWatering = currentUser.plants.filter((plant) => {
      const { lastWatering, id } = plant;
      const foundPlant = plants.find((plantLocal) => plantLocal.id === id);
      const { wateringOncePerDays } = foundPlant;
      const diffrenceTime = Math.abs(new Date() - toDateTime(lastWatering.seconds));
      const diffrenceDays = Math.ceil(diffrenceTime / (1000 * 60 * 60 * 24)) - 1;
      return wateringOncePerDays - diffrenceDays <= 0;
    });

    setPlantsToWatering(plantsToWatering);
  };

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
      });
    });

    setPlants(plantsLocal);

    plantsLocal.forEach((plant, index, array) => {
      getDownloadURL(ref(storage, `plantImages/${plant.id}.png`)).then((url) => {
        array[index].url = url;

        findPlantsToWatering([...plantsLocal]);
      });
    });
  };

  const moveToMyPlant = () => {
    const MyPlantsOptionElement = sidebarRef.current.querySelectorAll(".options .option")[1];
    MyPlantsOptionElement.click();
  };

  useEffect(() => {
    getPlants();
  }, []);

  return (
    <div className="main">
      <div className="header">
        <h1>Witaj {currentUser.username}!</h1>
      </div>
      <div className="plant-overview">
        <h2 className="title">
          {currentUser.plants.length === 0
            ? "Dodaj rośliny do kolekcji!"
            : plantsToWatering.length === 0
            ? "Wszystkie Twoje rośliny są podlane"
            : "Poświęć uwagę swoim roślinom"}
        </h2>
        <div className="carousel">
          {plantsToWatering.length !== 0
            ? plantsToWatering.map((plant, index) => {
                if (index < 3) {
                  const { id } = plant;
                  const foundPlant = plants.find((plantLocal) => plantLocal.id === id);
                  const { polishName, url } = foundPlant;

                  return (
                    <div className="item" onClick={() => moveToMyPlant()}>
                      <div className="image">
                        <img src={url}></img>
                      </div>
                      <p className="title">{polishName}</p>
                      <div className="hover-content">
                        <p>Przejdź do rośliny</p>
                        <span className="material-symbols-outlined">potted_plant</span>
                      </div>
                    </div>
                  );
                }
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Main;
