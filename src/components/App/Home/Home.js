import "./Home.css";
import Sidebar from "./Sidebar/Sidebar";
import Main from "./Main/Main";
import MyPlants from "./MyPlants/MyPlants";
import PlantsCatalog from "./PlantsCatalog/PlantsCatalog";
import { useRef, useState, useContext, useEffect, createContext } from "react";
import AccountSettings from "./AccountSettings/AccountSettings";
import AnotherUser from "./AnotherUser/AnotherUser";
import { currentUserContext } from "../App";

export const UserInUrlContext = createContext(null);

const Home = ({ setCurrentUser }) => {
  const currentUser = useContext(currentUserContext);

  const [givenUserIdInUrl, setGivenUserIdInUrl] = useState(null);
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

  useEffect(() => {
    setGivenUserIdInUrl(new URL(window.location.href).searchParams.get("user"));
  }, []);

  return (
    <div className="home">
      <Sidebar
        sidebarRef={sidebarRef}
        setGivenUserIdInUrl={setGivenUserIdInUrl}
        componentsUseStates={componentsUseStates}
        setCurrentUser={setCurrentUser}></Sidebar>
      <UserInUrlContext.Provider value={setGivenUserIdInUrl}>
        {currentUser.id === givenUserIdInUrl || givenUserIdInUrl === null ? (
          <div key="MainOptions" className="main-options">
            {isMainOpend && <Main sidebarRef={sidebarRef}></Main>}
            {isMyPlantsOpened && <MyPlants></MyPlants>}
            {isPlantsCatalogOpened && <PlantsCatalog></PlantsCatalog>}
            {isAccountSettingsOpened && <AccountSettings></AccountSettings>}
          </div>
        ) : (
          <AnotherUser key="AnotherUser" givenUserIdInUrl={givenUserIdInUrl}></AnotherUser>
        )}
      </UserInUrlContext.Provider>
    </div>
  );
};

export default Home;
