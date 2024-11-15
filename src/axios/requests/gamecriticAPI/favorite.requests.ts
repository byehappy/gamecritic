import { instanceAPI } from ".";

export const checkFavoriteGame = async(id: string,gameId:number) => {
    return await instanceAPI.get(`/user/favorite/${id}/${gameId}`);
  };
  export const getFavoriteGames = (id: string) => {
    return instanceAPI.get(`/user/favorites/${id}`);
  };
  export const addFavoriteGame = (id: string,gameId:number) => {
    return instanceAPI.post(`/user/favorites/${id}/${gameId}`);
  };
  export const delFavoriteGame = (id: string,gameId:number) => {
    return instanceAPI.post(`/user/unfavorites/${id}/${gameId}`);
  };