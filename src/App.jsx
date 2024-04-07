import "./App.css";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Characters from "./pages/Characters/Characters";
import Comics from "./pages/Comics/Comics";
import Character from "./pages/Character/Character";
import Comic from "./pages/Comic/Comic";
import { useState } from "react";
import Cookies from "js-cookie";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Favorites from "./pages/Favorite/Favorite";
import Error from "./pages/allPath/allPath";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

// Ajout des icônes à la library
library.add(farHeart, fasHeart);

function App() {
  const [visible, setVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [token, setToken] = useState(Cookies.get("marvel-token") || null);

  const handleToken = (token) => {
    if (token) {
      Cookies.set("marvel-token", token, { expires: 15 });
      setToken(token);
    } else {
      Cookies.remove("marvel-token");
      setToken(null);
    }
  };
  return (
    <Router>
      <Header
        visible={visible}
        setVisible={setVisible}
        logVisible={logVisible}
        setLogVisible={setLogVisible}
        token={token}
        handleToken={handleToken}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters token={token} />} />
        <Route path="/comics" element={<Comics token={token} />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/comic/:comicId" element={<Comic />} />
        <Route path="/favorites" element={<Favorites token={token} />} />
        <Route path="*" element={<Error token={token} />} />
      </Routes>
      {visible && <Signup setVisible={setVisible} handleToken={handleToken} />}
      {logVisible && (
        <Login setLogVisible={setLogVisible} handleToken={handleToken} />
      )}
    </Router>
  );
}

export default App;
