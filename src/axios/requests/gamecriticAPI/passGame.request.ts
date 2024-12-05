import { instanceAPI } from ".";
import { FilterFlags } from "../../../interfaces/filters";

export interface TopUsers {
  id: string;
  name: string;
  img_icon: string;
  gameCount: number;
}

export const getPassedGame = async (
  gameId: number,
  userId: string
): Promise<boolean> => {
  return instanceAPI
    .get(`/pass/game/${gameId}/${userId}`)
    .then((res) => res.data.passed);
};
export const addPassedGame = async (
  gameId: number | string,
  userId: string
) => {
  return instanceAPI.post(`/pass/game/${gameId}/${userId}`);
};
export const UnpassedGame = async (gameId: number | string, userId: string) => {
  return instanceAPI.delete(`/pass/game/${gameId}/${userId}`);
};
export const getTopUsers = async (): Promise<TopUsers[]> => {
  return instanceAPI.get("/top-users").then((res) => res.data.topUsers);
};

export const getUserCount = async (
  userId: string | number
): Promise<{ gameCount: number }> => {
  return instanceAPI.get(`/count-games/${userId}`).then((res) => res.data);
};

export const getPassedGamesUser = (userId: string,params?:FilterFlags) => {
  return instanceAPI.get(`/pass-games/user/${userId}`,{params});
} 
