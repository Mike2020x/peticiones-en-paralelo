import { useEffect, useState } from "react";
import axios from "axios";

const EpisodeList = () => {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://rickandmortyapi.com/api/episode");
        const episodesData = response.data.results.slice(0, 20);

        const episodePromises = episodesData.map(async (episode) => {
          const characterUrls = episode.characters.slice(0, 10);

          const characterPromises = characterUrls.map(async (url) => {
            const characterResponse = await axios.get(url);
            const character = characterResponse.data;
            return { name: character.name, species: character.species };
          });

          const characters = await Promise.all(characterPromises);
          return { episode: episode, characters: characters };
        });

        const episodeResults = await Promise.all(episodePromises);
        setEpisodes(episodeResults);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getCharactersFromEpisode = (episode) => {
    const characters = episode.characters.map((character) => ({
      name: character.name,
      species: character.species
    }));
    return characters;
  };

  return (
    <div>
      {episodes.map((episodeResult, index) => (
        <div key={index}>
          <h2>
            {episodeResult.episode.name} - {episodeResult.episode.episode}
          </h2>
          <p>Fecha al aire: {episodeResult.episode.air_date}</p>
          <h3>Personajes:</h3>
          <ul>
            {getCharactersFromEpisode(episodeResult).map((character, index) => (
              <li key={index}>
                {character.name} - {character.species}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
