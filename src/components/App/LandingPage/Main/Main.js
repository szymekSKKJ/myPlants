import "./Main.css";
import mainImage from "../../../../assets/main_page/main_plant.svg";

const Main = () => {
  return (
    <main>
      <div className="title-and-button-wrapper">
        <div className="title-wrapper">
          <h1>Utwórz swój roślinny katalog!</h1>
          <p>Dowiedz się czego Twoje rośliny potrzebują</p>
        </div>
        <button
          className="main-button"
          onClick={() => {
            window.scroll({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}>
          Załóż katalog!
        </button>
      </div>
      <div className="main-image">
        <img src={mainImage}></img>
      </div>
    </main>
  );
};

export default Main;
