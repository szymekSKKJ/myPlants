import "./RegisterAndLoginUserForms.css";
import { db } from "../../../../initializeFirebase";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import creatreNotification from "../../../../customJS/createNotification.js";

const RegisterAndLoginUserForms = () => {
  const isEmpty = (str) => !str.trim().length;

  const hasWhiteSpace = (string) => {
    return string.indexOf(" ") >= 0;
  };

  const checkIfPasswordInputAndRepeatPasswordInputThisSameValue = (passwordInput, repeatPasswordInput) => {
    return passwordInput.value === repeatPasswordInput.value;
  };

  const createUser = (usernameInput, emailInput, passwordInput) => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then(async (userCredential) => {
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
          displayName: usernameInput.value,
        });

        await setDoc(doc(db, "users", user.uid), {
          username: usernameInput.value,
          email: emailInput.value,
          plants: [],
        });
      })
      .catch((error) => {
        creatreNotification(error.message);
      });
  };

  const checkIfUsernameIsTaken = async (inputElement) => {
    let isUserFound = false;
    const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", inputElement.value)));
    querySnapshot.forEach((doc) => {
      isUserFound = true;
    });
    return isUserFound;
  };

  const validateRegisterUserForm = async () => {
    const registerUserFormInputElements = [...document.querySelectorAll("#register-user-form input")];
    const inputElementWithWhiteSpace = registerUserFormInputElements.find((inputElement) => hasWhiteSpace(inputElement.value));
    const InputElementWithEmptyContent = registerUserFormInputElements.find((inputElement) => isEmpty(inputElement.value));
    const hasPasswordInputAndRepeatPasswordInputThisSameValue = checkIfPasswordInputAndRepeatPasswordInputThisSameValue(
      registerUserFormInputElements[2],
      registerUserFormInputElements[3]
    );

    if (inputElementWithWhiteSpace === undefined) {
      if (InputElementWithEmptyContent === undefined) {
        if (hasPasswordInputAndRepeatPasswordInputThisSameValue === true) {
          const isUsernameTaken = await checkIfUsernameIsTaken(registerUserFormInputElements[0]);
          if (isUsernameTaken === false) {
            createUser(registerUserFormInputElements[0], registerUserFormInputElements[1], registerUserFormInputElements[2]);
          } else {
            creatreNotification("Nazwa użytkownika jest zajęta");
          }
        } else {
          creatreNotification("Hasła są różne");
        }
      } else {
        InputElementWithEmptyContent.focus();
        creatreNotification("Któryś input jest pust");
      }
    } else {
      inputElementWithWhiteSpace.focus();
      creatreNotification("Któryś input ma spację");
    }
  };

  const findUserEmailByUsername = async (username) => {
    let foundEmail = undefined;
    const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username)));
    querySnapshot.forEach((doc) => {
      const { email } = doc.data();
      foundEmail = email;
    });
    return foundEmail;
  };

  const loginUser = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        creatreNotification(error.message);
      });
  };

  const validateLoginUserForm = async () => {
    const registerUserFormInputElements = [...document.querySelectorAll("#login-user-form input")];
    const inputElementWithWhiteSpace = registerUserFormInputElements.find((inputElement) => hasWhiteSpace(inputElement.value));
    const InputElementWithEmptyContent = registerUserFormInputElements.find((inputElement) => isEmpty(inputElement.value));

    if (inputElementWithWhiteSpace === undefined) {
      if (InputElementWithEmptyContent === undefined) {
        const emailToLogin = await findUserEmailByUsername(registerUserFormInputElements[0].value);
        if (emailToLogin !== undefined) {
          loginUser(emailToLogin, registerUserFormInputElements[1].value);
        } else {
          creatreNotification("Użytkownik o takim loginie nie istnieje");
        }
      } else {
        InputElementWithEmptyContent.focus();
        creatreNotification("Któryś input jest pust");
      }
    } else {
      inputElementWithWhiteSpace.focus();
      creatreNotification("Któryś input ma spację");
    }
  };

  return (
    <div className="register-and-login-user-form">
      <h2>Stań się częścią roślinnego świata!</h2>
      <div className="forms-wrapper">
        <div className="form-wrapper">
          <h3>Zarejestruj się!</h3>
          <form noValidate id="register-user-form" onSubmit={(event) => event.preventDefault()}>
            <div className="input-wrapper">
              <input placeholder="Nazwa użytkownika" required></input>
              <label>Nazwa użytkownika</label>
            </div>
            <div className="input-wrapper">
              <input placeholder="Email" required></input>
              <label>Email</label>
            </div>
            <div className="input-wrapper">
              <input placeholder="Hasło" type="password" required></input>
              <label>Hasło</label>
            </div>
            <div className="input-wrapper">
              <input placeholder="Powtórz hasło" type="password" required></input>
              <label>Powtórz hasło</label>
            </div>
            <button className="main-button" onClick={() => validateRegisterUserForm()}>
              Utwórz konto
            </button>
          </form>
        </div>
        <p>Lub</p>
        <div className="form-wrapper">
          <h3>Zaloguj się!</h3>
          <form noValidate id="login-user-form" onSubmit={(event) => event.preventDefault()}>
            <div className="input-wrapper">
              <input placeholder="Nazwa użytkownika" required></input>
              <label>Nazwa użytkownika</label>
            </div>
            <div className="input-wrapper">
              <input placeholder="Hasło" type="password" required></input>
              <label>Hasło</label>
            </div>
            <button className="main-button" onClick={() => validateLoginUserForm()}>
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterAndLoginUserForms;
