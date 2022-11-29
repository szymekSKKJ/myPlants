import "./LandingPage.css";
import Main from "./Main/Main";
import Header from "./Header/Header";
import RegisterAndLoginUserForms from "./RegisterAndLoginUserForms/RegisterAndLoginUserForms";
import Offers from "./Offers/Offers";

const LandingPage = () => {
  return (
    <div className="landging-page">
      <Header></Header>
      <Main></Main>
      <Offers></Offers>
      <RegisterAndLoginUserForms></RegisterAndLoginUserForms>
    </div>
  );
};

export default LandingPage;
