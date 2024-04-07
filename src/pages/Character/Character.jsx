import "./Character.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Character = () => {
  const [hero, setHero] = useState(null);
  const [comics, setComics] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("avant fetch");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/character/${id}`
        );
        const comicsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics/${id}`
        );
        setComics(comicsResponse.data.comics);
        setHero(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="character">
      {hero && (
        <div className="charatersection">
          <div className="cardchar">
            <h2 className="heroname">{hero.name}</h2>
            {hero.thumbnail && (
              <img
                src={`${hero.thumbnail.path}/portrait_xlarge.${hero.thumbnail.extension}`}
                alt={hero.name}
                className="heroimage"
              />
            )}
            <p className="description">{hero.description}</p>
          </div>
          <h3 className="comich3">Comics associés :</h3>
          <ul className="comiclist">
            {comics &&
              comics.map((comic) => (
                <Link to={`/comic/${comic._id}`} key={comic._id}>
                  <li>
                    <img
                      src={`${comic.thumbnail.path}/portrait_xlarge.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      className="comicimg"
                    />
                    <h4 className="comich4">{comic.title}</h4>
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Character;
