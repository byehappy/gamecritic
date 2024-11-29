import { AxiosPromise } from "axios";
import { instanceAPI } from ".";
import { FilterType } from "../../../interfaces/filters";
import { IGame } from "../../../interfaces/games";

export interface Tier {
  id: string;
  title: string;
  imageSrc?: string;
  rows: { id: string; name: string; color: string }[];
  filters: { [key: string]: FilterType };
  pickGame?: number[];
  author_id: string;
}
export interface ViewTier extends Omit<Tier, "pickGame"> {
  pickGame: IGame[] | [];
  count: number | null;
}
export interface UserTier {
  user: {
    id: string;
    name: string;
    image:string;
  };
  tier: {
    id: number | string;
    title: string;
  };
  present_image: string;
}

export const getAllTiers = async (): Promise<Tier[]> => {
  const response = await instanceAPI
    .get<Tier[]>("/tierlist")
    .then((res) => res.data);
  return response;
};

export const getUsersTiers = async (): Promise<UserTier[]> => {
  return await instanceAPI.get(`/tierlists/users`).then((res) => res.data);
};

export const getTierById = (id: string): AxiosPromise<ViewTier> => {
  return instanceAPI.get(`/tierlist/${id}`);
};

export const getUserTiers = async (userId: string): AxiosPromise<Tier[]> => {
  return await instanceAPI.get(`/user/tierlists/${userId}`);
};
export const getAuthorTiersSize = async (
  userId: string,
  size: number
): AxiosPromise<Tier[]> => {
  return await instanceAPI.get(`/author-tierlist/${userId}/${size}`);
};
export const getAuthorTiers = async (userId: string): AxiosPromise<Tier[]> => {
  return await instanceAPI.get(`/author-tierlist/${userId}/all`);
};

export const getUserRows = async (userId: string, tierId: string) => {
  return await instanceAPI.get(`/user/rows/${userId}/${tierId}`);
};

export const updateUserRows = async (
  userId: string,
  tierId: string | number,
  rows: string,
  present_img?: string
) => {
  return await instanceAPI.post(`/user/rows/${userId}/${tierId}`, {
    rows,
    present_img,
  });
};

export const DeleteTier = async (tierId: string, userId: string) => {
  return await instanceAPI.delete(`/delete-tierlist/${tierId}/${userId}`);
};

export const UploadTier = async (tier: Omit<Tier, "id">) => {
  return await instanceAPI.post("/create-tierlist", { ...tier });
};
