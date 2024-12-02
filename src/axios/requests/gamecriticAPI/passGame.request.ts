import { instanceAPI } from ".";

export interface TopUsers {
  id: string,
  name: string,
  img_icon:string,
  gameCount: number
}

export const getPassedGame = async (gameId: number, userId: string):Promise<boolean> => {
  return instanceAPI.get(`/pass/game/${gameId}/${userId}`).then(res=> res.data.passed);
};
export const addPassedGame = async (gameId: number | string, userId: string) => {
  return instanceAPI.post(`/pass/game/${gameId}/${userId}`);
};
export const UnpassedGame = async (gameId: number | string, userId: string)=> {
  return instanceAPI.delete(`/pass/game/${gameId}/${userId}`);
};
export const getTopUsers  = async ():Promise<TopUsers[]> => {
  return instanceAPI.get("/top-users").then(res=> res.data.topUsers);
};