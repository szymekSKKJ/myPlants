import "./Sidebar.css";
import profieImage from "../../../../assets/default_user.png";
import { useContext } from "react";
import { currentUserContext } from "../../App";
import { getAuth, signOut } from "firebase/auth";
import { TransitionButton } from "react-components-transition";

const Sidebar = ({ sidebarRef, setCurrentUser, setGivenUserIdInUrl }) => {
  const currentUser = useContext(currentUserContext);

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setCurrentUser(undefined);
      })
      .catch((error) => {});
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      {currentUser && (
        <>
          <div className="user-profile">
            <div className="image">
              <img src={currentUser.profileImage !== undefined ? currentUser.profileImage : profieImage}></img>
            </div>
            <div className="username">
              <p>{currentUser.username}</p>
            </div>
          </div>
          <div className="options">
            <TransitionButton show="Main" className="option">
              <p className="title">Początek</p>
              <div className="icon">
                <span className="material-symbols-outlined">home</span>
              </div>
            </TransitionButton>
            <TransitionButton show="MyPlants" className="option">
              <p className="title">Moje rośliny</p>
              <div className="icon">
                <span className="material-symbols-outlined">favorite</span>
              </div>
            </TransitionButton>
            <TransitionButton show="PlantsCatalog" className="option">
              <p className="title">Przeglądaj rośliny</p>
              <div className="icon">
                <span className="material-symbols-outlined">grass</span>
              </div>
            </TransitionButton>
            <TransitionButton show="PlantsShop" className="option">
              <p className="title">Kup rośliny</p>
              <div className="icon">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
            </TransitionButton>
            <TransitionButton show="AccountSettings" className="option">
              <p className="title">Ustawienia konta</p>
              <div className="icon">
                <span className="material-symbols-outlined">settings</span>
              </div>
            </TransitionButton>
            <TransitionButton className="option" onClick={() => logout}>
              <p className="title">Wyloguj się</p>
              <div className="icon">
                <span className="material-symbols-outlined">logout</span>
              </div>
            </TransitionButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
