import "./Header.css";

const Header = () => {
  return (
    <header>
      <button
        className="main-button"
        onClick={() => {
          window.scroll({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }}>
        Zaloguj się
      </button>
    </header>
  );
};

export default Header;
