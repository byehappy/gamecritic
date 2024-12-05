import axios from "axios";
import { FilterFlags } from "../../interfaces/filters";
import {
  GetGames,
  GetGenres,
  GetPlatforms,
  GetTags,
} from "../../interfaces/axios/rawg.response";
import { IGame, IGameOnly } from "../../interfaces/games";

const instanceRawg = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: import.meta.env.VITE_API_KEY,
  },
});
export const gamesRequest = (params: FilterFlags | Record<string, string>) => {
  return instanceRawg.get<GetGames>("/games", {
    params,
  });
};

export const gameRequest = (id: number) => {
  return instanceRawg.get<IGameOnly | IGame>(`/games/${id}`);
};
export const gameScreenshots = (id: number) => {
  return instanceRawg
    .get<{ results: [{ image: string; id: number }] }>(
      `/games/${id}/screenshots`
    )
    .then((res) => res.data);
};

export const tagsRequest = () => {
  return instanceRawg.get<GetTags>("/tags");
};

export const genresRequest = () => {
  return instanceRawg.get<GetGenres>("/genres");
};
export const platformsRequest = () => {
  return instanceRawg.get<GetPlatforms>("/platforms");
};
