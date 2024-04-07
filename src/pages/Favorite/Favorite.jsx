import "./Favorite.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Favorites = ({ token }) => {
  const [characterFavorites, setCharacterFavorites] = useState([]);
  const [comicFavorites, setComicFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            withCredentials: true,
          }
        );

        const favoritesData = response.data;

        // Utiliser des critères spécifiques pour filtrer les personnages et les comics
        const characters = favoritesData.filter((fav) => fav.name); // Présence du champ 'name'
        const comics = favoritesData.filter((fav) => fav.title); // Présence du champ 'title'

        setCharacterFavorites(characters);
        setComicFavorites(comics);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (isLoading) {
    return <div>Chargement de vos favoris...</div>;
  }

  return (
    <main className="favpage">
      <div className="favtitle">
        <h2 className="favoriteh2">Personnages Favoris</h2>
      </div>
      <div className="favchar">
        {characterFavorites.map((fav, index) => (
          <div key={index} className="charcard">
            <Link to={`/character/${fav._id}`}>
              <h3 className="favoriteh3">{fav.name}</h3>
              <img
                src={`${fav.thumbnail?.path}/portrait_xlarge.${fav.thumbnail?.extension}`}
                alt={fav.name}
                className="favimg"
              />
            </Link>
          </div>
        ))}
      </div>
      <div className="favtitle">
        <h2 className="favoriteh2">Comics Favoris</h2>
      </div>
      <div className="favcomics">
        {comicFavorites.map((fav, index) => (
          <div key={index} className="comiccard">
            <Link to={`/comic/${fav._id}`}>
              <h3 className="favoriteh3">{fav.title}</h3>
              <img
                src={`${fav.thumbnail?.path}/portrait_xlarge.${fav.thumbnail?.extension}`}
                alt={fav.title}
                className="favimg"
              />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Favorites;
