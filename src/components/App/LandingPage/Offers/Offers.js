import "./Offers.css";

const Offers = () => {
  return (
    <div className="offers">
      <div className="item">
        <div className="backgrond-icon">
          <span className="material-symbols-outlined">schedule</span>
        </div>
        <p className="content">Będziemy za Ciebie pamiętać o podlaniu roślin!</p>
      </div>
      <div className="item">
        <div className="backgrond-icon">
          <span className="material-symbols-outlined">folder</span>
        </div>
        <p className="content">Wszystkie rośliny w jednym miejscu!</p>
      </div>
      <div className="item">
        <div className="backgrond-icon">
          <span className="material-symbols-outlined">help</span>
        </div>
        <p className="content">Dowiaduj się więcej o swoich roślinach!</p>
      </div>
    </div>
  );
};

export default Offers;
