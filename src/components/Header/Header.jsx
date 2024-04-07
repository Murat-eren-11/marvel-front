import "./Header.css";
import marvelLogo from "../../../public/Marvel_Logo.svg.png";
import { Link } from "react-router-dom";

const Header = ({
  visible,
  setVisible,
  logVisible,
  setLogVisible,
  token,
  handleToken,
}) => {
  return (
    <header>
      <div className="logocontainer">
        <Link to="/">
          <img src={marvelLogo} className="logo" alt="" />
        </Link>
      </div>
      <div className="loginsignup">
        {token ? (
          <button
            className="sedeco"
            onClick={() => {
              handleToken(null);
            }}
          >
            Se déconnecter
          </button>
        ) : (
          <>
            <button className="signup" onClick={() => setVisible(!visible)}>
              S'inscrire
            </button>
            <p className="divise">||</p>
            <button
              className="login"
              onClick={() => setLogVisible(!logVisible)}
            >
              Se connecter
            </button>
          </>
        )}
      </div>
      <div className="butonnav">
        <Link to="/characters">
          <button className="headbtn">Characters</button>
        </Link>
        <Link to="/comics">
          <button className="headbtn">Comics</button>
        </Link>
        {token ? (
          <Link to="/favorites">
            {" "}
            <button className="headbtn">Favorite</button>{" "}
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
