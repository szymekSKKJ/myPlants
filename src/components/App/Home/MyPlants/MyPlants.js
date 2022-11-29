import "./MyPlants.css";
import { useEffect, useContext, useState } from "react";
import { currentUserContext } from "../../App";
import { db, storage } from "../../../../initializeFirebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

const MyPlants = () => {
  const currentUser = useContext(currentUserContext);
  const [plants, setPlants] = useState([]);

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

    plantsLocal.forEach((plant, index, array) => {
      getDownloadURL(ref(storage, `plantImages/${plant.id}.png`)).then((url) => {
        array[index].url = url;

        setPlants([...array]);
      });
    });
  };

  const toDateTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date;
  };

  const waterPlant = async (canWaterPlant, currentPlantId, lastWatering) => {
    if (canWaterPlant) {
      await updateDoc(doc(db, "users", currentUser.id), {
        plants: arrayRemove({
          id: currentPlantId,
          lastWatering: lastWatering,
        }),
      });

      await updateDoc(doc(db, "users", currentUser.id), {
        plants: arrayUnion({
          id: currentPlantId,
          lastWatering: new Date(),
        }),
      });
    }
  };

  useEffect(() => {
    getPlants();
  }, []);

  return (
    <div className="my-plants">
      <div className="header">
        <h1>Moje rośliny</h1>
      </div>
      <div className="collection">
        {plants.length !== 0 &&
          currentUser.plants.map((plant) => {
            const { id, lastWatering } = plant;
            const foundPlant = plants.find((plantLocal) => plantLocal.id === id);
            const { polishName, wateringOncePerDays, url } = foundPlant;
            const diffrenceTime = Math.abs(new Date() - toDateTime(lastWatering.seconds));
            const diffrenceDays = Math.ceil(diffrenceTime / (1000 * 60 * 60 * 24)) - 1;
            const canWaterPlant = wateringOncePerDays - diffrenceDays <= 0;
            const daysAmmount = parseInt(wateringOncePerDays - diffrenceDays);

            return (
              <div className="plant">
                <div className="image">
                  <img src={url}></img>
                </div>
                <p className="name">{polishName}</p>
                <div className="watering">
                  <button className="main-button" onClick={() => waterPlant(canWaterPlant, id, lastWatering)}>
                    {canWaterPlant ? "Podlej" : `Podlewanie za ${daysAmmount} dni`}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyPlants;
