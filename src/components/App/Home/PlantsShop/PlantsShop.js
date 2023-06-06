import "./PlantsShop.css";
import { db } from "../../../../initializeFirebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
const { collection, getDocs } = require("firebase/firestore");

const getAllPlants = async (setPlants) => {
  const querySnapshot = await getDocs(collection(db, "plants"));
  const storage = getStorage();
  const plantsData = [];

  querySnapshot.forEach((doc) => {
    getDownloadURL(ref(storage, `plantImages/${doc.id}.png`))
      .then((url) => {
        setPlants((currentValues) => [
          {
            id: doc.id,
            src: url,
            ...doc.data(),
          },
          ...currentValues,
        ]);
      })
      .catch((error) => {
        // Handle any errors
      });
  });
};

const PlantsShop = () => {
  const [plants, setPlants] = useState([]);
  useEffect(() => {
    getAllPlants(setPlants);
  }, []);

  return (
    <div className="plants-shop">
      <div className="plants-items">
        {plants.length !== 0 &&
          plants.map((plantData) => {
            const { id, src, polishName, price, paymentLink } = plantData;

            const formatter = new Intl.NumberFormat("pl-PL", {
              style: "currency",
              currency: "PLN",
            });

            return (
              <div className="plant-item" key={id}>
                <div className="image">
                  <img src={src}></img>
                </div>
                <p className="name">{polishName}</p>
                <button
                  className="main-button"
                  onClick={() =>
                    window.open(
                      `${paymentLink}`,
                      "_blank",
                      `location=yes,height=${window.screen.height * 0.75}px,width=${window.screen.height * 0.75 * (3 / 4)}px,scrollbars=yes,status=yes`
                    )
                  }>
                  Kup za: {formatter.format(parseFloat(price))}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlantsShop;
