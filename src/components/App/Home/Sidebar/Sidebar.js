import "./Sidebar.css";
import profieImage from "../../../../assets/default_user.png";
import { useContext } from "react";
import { currentUserContext } from "../../App";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = ({ componentsUseStates, sidebarRef, setCurrentUser }) => {
  const currentUser = useContext(currentUserContext);

  const openComponent = (index) => {
    componentsUseStates.forEach((componentUseState) => {
      componentUseState.useState(false);
    });

    componentsUseStates[index].useState(true);
  };

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
      <div className="user-profile">
        <div className="image">
          <img src={currentUser.profileImage !== undefined ? currentUser.profileImage : profieImage}></img>
        </div>
        <div className="username">
          <p>{currentUser.username}</p>
        </div>
      </div>
      <div className="options">
        <div className="option" onClick={() => openComponent(0)}>
          <p className="title">Początek</p>
          <div className="icon">
            <span className="material-symbols-outlined">home</span>
          </div>
        </div>
        <div className="option" onClick={() => openComponent(1)}>
          <p className="title">Moje rośliny</p>
          <div className="icon">
            <span className="material-symbols-outlined">favorite</span>
          </div>
        </div>
        <div className="option" onClick={() => openComponent(2)}>
          <p className="title">Przeglądaj rośliny</p>
          <div className="icon">
            <span className="material-symbols-outlined">grass</span>
          </div>
        </div>
        <div className="option" onClick={() => openComponent(3)}>
          <p className="title">Ustawienia konta</p>
          <div className="icon">
            <span className="material-symbols-outlined">settings</span>
          </div>
        </div>
        <div className="option" onClick={() => logout()}>
          <p className="title">Wyloguj się</p>
          <div className="icon">
            <span className="material-symbols-outlined">logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
