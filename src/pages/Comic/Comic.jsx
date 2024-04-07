import "./Comic.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Comic = () => {
  const [comic, setComic] = useState(null);

  const { comicId } = useParams();
  useEffect(() => {
    console.log(comicId);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comic/${comicId}`
        );
        setComic(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [comicId]);

  if (!comic) {
    return <div>Loading...</div>; // Affiche un message de chargement pendant la récupération des données
  }

  return (
    <main className="comicmain">
      <div className="comicsection">
        <h2 className="comicname">{comic.title}</h2>
        <img
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          alt={`Cover of ${comic.title}`}
        />
        <p className="comicdescription">
          {comic.description || "No description available."}
        </p>
      </div>
    </main>
  );
};

export default Comic;
