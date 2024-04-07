import "./Characters.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const Characters = ({ token }) => {
  const [heroes, setHeroes] = useState([]);
  const [limit, setLimit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker l'ID de recherche
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            headers: {
              Authorization: token,
            },
            withCredentials: true,
          }
        );
        // Supposons que l'API renvoie une liste d'objets favoris avec une propriété characterId
        setFavorites(response.data.map((fav) => fav.characterId));
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/characters`,
          {
            params: {
              limit: limit,
              skip: skip,
              name: searchTerm,
            },
          }
        );

        const updatedHeroes = response.data.results.map((hero) => ({
          ...hero,
          favorited: false,
        }));
        setHeroes(updatedHeroes);
        setTotal(response.data.count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [limit, skip, searchTerm]);

  useEffect(() => {
    // Met à jour les personnages avec le statut de favori une fois que les favoris sont chargés
    setHeroes((currentHeroes) =>
      currentHeroes.map((hero) => ({
        ...hero,
        favorited: favorites.includes(hero._id),
      }))
    );
  }, [favorites]);
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcul dynamique du début et de la fin de la plage des numéros de page visibles
  const visiblePages = 10;
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(startPage + visiblePages - 1, totalPages);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const handleSearch = (newValue) => {
    setSearchTerm(newValue);
  };

  const handleFavorite = async (heroId) => {
    try {
      // Récupérer l'identifiant de l'utilisateur à partir du cookie

      // Vérifier si le cookie contenant le token existe
      if (token) {
        console.log("Token exists, sending POST request...");

        // Envoyer la requête POST au back-end avec l'identifiant de l'utilisateur et du personnage
        await axios.post(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            userId: token, // Envoyer le token comme identifiant de l'utilisateur
            characterId: heroId, // Envoyer l'identifiant du personnage
          },
          {
            withCredentials: true, // Inclure les cookies dans la requête
          }
        );

        console.log("POST request successful");
        setFavorites((currentFavorites) => [...currentFavorites, heroId]);
        // Mettre à jour l'état des héros pour marquer celui-ci comme favori
        setHeroes((prevHeroes) => {
          return prevHeroes.map((hero) => {
            if (hero._id === heroId) {
              return { ...hero, favorited: true };
            }
            return hero;
          });
        });
      } else {
        console.error("Error: marvel-token cookie not found");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  return (
    <main className="container">
      <SearchBar
        onSearch={handleSearch}
        context="characters"
        searchParameter="name"
      />
      <div className="pagination">
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <button
            key={startPage + i}
            onClick={() => handlePageChange(startPage + i)}
            className={currentPage === startPage + i ? "active" : ""}
          >
            {startPage + i}
          </button>
        ))}
      </div>
      <section className="characterSection">
        {heroes.map((hero, index) => (
          <div className="herocard" key={index}>
            <Link to={`/character/${hero._id}`}>
              <h3>{hero.name}</h3>
              <img
                src={`${hero.thumbnail.path}/portrait_xlarge.${hero.thumbnail.extension}`}
                alt={hero.name}
              />{" "}
            </Link>
            <div
              className="favorite-button"
              onClick={() => handleFavorite(hero._id)}
            >
              <FontAwesomeIcon icon={hero.favorited ? fasHeart : farHeart} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Characters;
