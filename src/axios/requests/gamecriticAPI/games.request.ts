import { instanceAPI } from ".";
import { FilterFlags } from "../../../interfaces/filters";
import { IGame } from "../../../interfaces/games";

export const getGamesOnIdsRequest = (
  ids: string,
  params: FilterFlags | Record<string, string>
) => {
  return instanceAPI.get<{
    meta: { total: number; page: number; page_size: number };
    games: IGame[];
  }>(`/get-games/`, {
    params: { ...params, ids },
  });
};

export const getGame = (id: number | number[]) => {
  return instanceAPI.get<IGame | IGame[]>(`/get-game/${id}`);
};
