import "./Home.css";
import Sidebar from "./Sidebar/Sidebar";
import Main from "./Main/Main";
import MyPlants from "./MyPlants/MyPlants";
import PlantsCatalog from "./PlantsCatalog/PlantsCatalog";
import { useEffect, useRef, useState, useContext } from "react";
import AccountSettings from "./AccountSettings/AccountSettings";

const Home = ({ setCurrentUser }) => {
  const [isMainOpend, setIsMainOpend] = useState(true);
  const [isMyPlantsOpened, setIsMyPlantsOpened] = useState(false);
  const [isPlantsCatalogOpened, setIsPlantsCatalogOpened] = useState(false);
  const [isAccountSettingsOpened, setIsAccountSettingsOpened] = useState(false);
  const sidebarRef = useRef(null);

  const componentsUseStates = [
    {
      title: "Początek",
      useState: setIsMainOpend,
    },
    {
      title: "Moje rośliny",
      useState: setIsMyPlantsOpened,
    },
    {
      title: "Przeglądaj rośliny",
      useState: setIsPlantsCatalogOpened,
    },
    {
      title: "Ustawienia konta",
      useState: setIsAccountSettingsOpened,
    },
  ];

  return (
    <div className="home">
      <Sidebar sidebarRef={sidebarRef} componentsUseStates={componentsUseStates} setCurrentUser={setCurrentUser}></Sidebar>
      {isMainOpend && <Main sidebarRef={sidebarRef}></Main>}
      {isMyPlantsOpened && <MyPlants></MyPlants>}
      {isPlantsCatalogOpened && <PlantsCatalog></PlantsCatalog>}
      {isAccountSettingsOpened && <AccountSettings></AccountSettings>}
    </div>
  );
};

export default Home;
