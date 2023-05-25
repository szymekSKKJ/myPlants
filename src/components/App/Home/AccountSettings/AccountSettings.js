import "./AccountSettings.css";
import { storage } from "../../../../initializeFirebase";
import { ref, uploadBytes } from "firebase/storage";
import { useContext } from "react";
import { currentUserContext } from "../../App";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const AccountSettings = () => {
  const currentUser = useContext(currentUserContext);

  const changeProfileImage = () => {
    const inputElement = document.createElement("input");

    inputElement.type = "file";

    inputElement.click();

    inputElement.addEventListener(
      "change",
      () => {
        const inputElementFile = inputElement.files[0];

        if (inputElementFile.type.toLocaleLowerCase().includes("image")) {
          if (
            inputElementFile.type.toLocaleLowerCase().includes("png") ||
            inputElementFile.type.toLocaleLowerCase().includes("jpg") ||
            inputElementFile.type.toLocaleLowerCase().includes("jpeg")
          ) {
            const storageRef = ref(storage, `usersProfileImages/${currentUser.id}`);
            uploadBytes(storageRef, inputElementFile).then((snapshot) => {
              console.log("Uploaded a blob or file!");
              window.location.reload();
            });
          }
        } else {
          console.log("Wybrano nie odpowiedni format pliku");
        }
      },
      { once: true }
    );
  };

  const restUserPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, currentUser.email)
      .then(() => {
        console.log("Rest password email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className="account-settings">
      <div className="header">
        <h1>Ustawienia konta</h1>
      </div>
      <div className="options">
        <div className="option" onClick={() => changeProfileImage()}>
          <p className="title">
            Zmień zdjęcie profilowe <span>Dozwolone formaty to (png,jpg,jpeg)</span>
          </p>
        </div>
        <div className="option" onClick={() => restUserPassword()}>
          <p className="title">
            Zmień hasło <span>Wysyła email z linkiem resetującym</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
