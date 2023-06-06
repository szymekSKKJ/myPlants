import "./Home.css";
import Sidebar from "./Sidebar/Sidebar";
import Main from "./Main/Main";
import MyPlants from "./MyPlants/MyPlants";
import PlantsCatalog from "./PlantsCatalog/PlantsCatalog";
import { useRef, useState, useContext, useEffect, createContext } from "react";
import AccountSettings from "./AccountSettings/AccountSettings";
import AnotherUser from "./AnotherUser/AnotherUser";
import { currentUserContext } from "../App";
import PlantsShop from "./PlantsShop/PlantsShop";
import { ComponentsTransition, TransitionChild } from "react-components-transition";

export const UserInUrlContext = createContext(null);

const Home = ({ setCurrentUser }) => {
  const currentUser = useContext(currentUserContext);
  const [givenUserIdInUrl, setGivenUserIdInUrl] = useState(null);

  const sidebarRef = useRef(null);
  const sidebarWrapperRef = useRef(null);

  useEffect(() => {
    setGivenUserIdInUrl(new URL(window.location.href).searchParams.get("user"));
  }, []);

  const firstVisibleComponent = givenUserIdInUrl !== null ? "AnotherUser" : "Main";

  return (
    <div className="home">
      <UserInUrlContext.Provider value={setGivenUserIdInUrl}>
        <div className="sidebar-wrapper" ref={sidebarWrapperRef}></div>
        <ComponentsTransition firstVisible={firstVisibleComponent}>
          <TransitionChild renderTo={sidebarWrapperRef} isStatic={true}>
            <Sidebar sidebarRef={sidebarRef} setGivenUserIdInUrl={setGivenUserIdInUrl} setCurrentUser={setCurrentUser}></Sidebar>
          </TransitionChild>

          <AnotherUser key="AnotherUser" givenUserIdInUrl={givenUserIdInUrl}></AnotherUser>
          <Main key="Main" sidebarRef={sidebarRef}></Main>
          <PlantsCatalog key="PlantsCatalog"></PlantsCatalog>
          <MyPlants key="MyPlants"></MyPlants>
          <PlantsShop key="PlantsShop"></PlantsShop>
          <AccountSettings key="AccountSettings"></AccountSettings>
        </ComponentsTransition>
      </UserInUrlContext.Provider>
    </div>
  );
};

export default Home;
