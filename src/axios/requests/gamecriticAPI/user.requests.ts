import { AxiosPromise, AxiosResponse } from "axios";
import { instanceAPI } from ".";
import { IAboutGame } from "../../../interfaces/aboutGames";
import { SameUsers } from "../../../interfaces/users";

export const getUserInfo = async (id: string) => {
  return instanceAPI.get(`/user/info/${id}`);
};
export const uploadUserInfo = async (
  id: string,
  update: { name?: string; about_text?: string; img_icon?: string }
) => {
  return instanceAPI.patch(`/user/info/${id}`, { update });
};

export const getAllAboutGames = async (
  userId: string
): Promise<IAboutGame[]> => {
  return instanceAPI
    .get(`/about/all-games/${userId}`)
    .then((res) => JSON.parse(res.data.about_games))
    .catch((err) => console.error(err));
};

export const getAboutGame = async (
  userId: string,
  cardId: string
): Promise<AxiosPromise<IAboutGame>> => {
  return instanceAPI.get(`/about/game/${cardId}/${userId}`);
};

export const updateAboutGame = async (
  userId: string,
  cardId: string,
  value: number
) => {
  return instanceAPI.patch(`/about/game/${cardId}/${userId}`, { value });
};

export const getTheSameUsers = async (
  id: string,tierId:string,
): Promise<AxiosResponse<{ users: SameUsers[] }, any>> => {
  return instanceAPI.get(`/the-same-users/${id}/${tierId}`);
};
