import "./Signup.css";
import axios from "axios";
import { useState } from "react";

const Signup = ({ visible, setVisible, handleToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          username: username,
          email: email,
          password: password,
        }
      );
      handleToken(response.data.token);
      setVisible(false);
    } catch (error) {
      console.log("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <div
      className="modal"
      onClick={() => {
        setVisible(false);
      }}
    >
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-card">
          <h2>Rejoins les Super-Héros les plus puissants de ta galaxie</h2>
          <form onSubmit={userSignUp} className="formplease">
            <input
              className="usernamesignup"
              type="text"
              value={username}
              placeholder="nom d'utilisateur"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              value={email}
              placeholder="moi@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
            />
            <button className="inscrire" type="submit">
              Inscrivez-vous
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
