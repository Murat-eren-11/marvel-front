import "./allPath.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Error = ({ token }) => {
  const [isFormateur, setIsFormateur] = useState(false);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const responseProf = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          {
            withCredentials: true,
          }
        );
        console.log("on a get");
        const usernameNormalized = responseProf.data.username
          .toLowerCase()
          .replace(/\d+/g, "");
        const formateurs = ["tom", "alexis", "lucas", "murat", "antoine"].map(
          (name) => name.toLowerCase()
        );

        if (formateurs.includes(usernameNormalized)) {
          setIsFormateur(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProf();
  }, [token]);

  return (
    <main>
      {isFormateur && (
        <div className="troll">
          <h3>
            Vous avez trouvé l'easter eggs, amusez-vous bien (spécial formateur)
          </h3>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <div className="img404">
        <img src="https://i.imgflip.com/8luei1.jpg" title="Hulk Angry" />
      </div>
    </main>
  );
};

export default Error;
