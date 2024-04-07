import "./Comics.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const Comics = ({ token }) => {
  const [comics, setComics] = useState([]);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return; // S'assurer qu'un token est disponible
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const comicIds = data.map((fav) => fav.comicId); // Ajustez selon la structure de votre réponse
        setFavorites(comicIds);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics`,
          {
            params: {
              limit,
              skip: (currentPage - 1) * limit,
              title: searchTerm,
            },
          }
        );
        const updatedComics = data.results.map((comic) => ({
          ...comic,
          favorited: favorites.includes(comic._id),
        }));
        setComics(updatedComics);
        setTotal(data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [limit, currentPage, searchTerm, favorites]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(total / limit);

  // Nombre de numéros de page visibles à la fois
  const visiblePages = 10;
  // Calculer le début et la fin de la plage de pages
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(startPage + visiblePages - 1, totalPages);

  // Ajuster le début si la plage est trop petite
  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const handleSearch = (newValue) => {
    setSearchTerm(newValue);
  };
  const handleFavorite = async (comicId) => {
    if (!token) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      const isFavorited = favorites.includes(comicId);
      const url = `${import.meta.env.VITE_API_URL}/favorite/`;

      await axios.post(
        url,
        { comicId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      // Mise à jour de l'état des favoris et des comics après l'ajout/suppression
      if (isFavorited) {
        setFavorites((favs) => favs.filter((id) => id !== comicId));
      } else {
        setFavorites((favs) => [...favs, comicId]);
      }

      setComics((comics) =>
        comics.map((comic) =>
          comic._id === comicId ? { ...comic, favorited: !isFavorited } : comic
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
    }
  };

  return (
    <main className="container">
      <SearchBar
        onSearch={handleSearch}
        context="comics"
        searchParameter="title"
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
      <section className="comicsSection">
        {comics.map((comic, index) => (
          <div className="comiccard" key={index}>
            <Link to={`/comic/${comic._id}`}>
              <h3>{comic.title}</h3>
              <img
                src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                alt={comic.title}
              />
              {/* <p>{comic.description ? comic.description.slice(0, 50) : ""}</p> */}
            </Link>
            <div
              className="favorite-button"
              onClick={() => handleFavorite(comic._id)}
            >
              <FontAwesomeIcon icon={comic.favorited ? fasHeart : farHeart} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Comics;
