import { AxiosPromise } from "axios";
import { instanceAPI } from ".";

export interface Tier {
  id: string;
  title: string;
  imageSrc?: string;
  genres?: string;
  platforms?: string;
  tags?: string;
}
export interface UserTier {
  user: {
    id: string;
    name: string;
  };
  tier: {
    id: number | string;
    title: string;
  };
  present_image: string;
}

let currentAbortController: AbortController | null = null;

export const getAllTiers = async (): Promise<Tier[]> => {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  const response = await instanceAPI
    .get<Tier[]>("/tierlist", { signal: currentAbortController.signal })
    .then((res) => res.data);
  currentAbortController = null;
  return response;
};

export const getUsersTiers = async (): Promise<UserTier[]> => {
  return await instanceAPI.get(`/tierlists/users`).then((res) => res.data);
};

export const getTierById = (id: string): AxiosPromise<Tier> => {
  return instanceAPI.get(`/tierlist/${id}`);
};

export const getUserTiers = async (userId: string): AxiosPromise<Tier[]> => {
  return await instanceAPI.get(`/user/tierlists/${userId}`);
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
