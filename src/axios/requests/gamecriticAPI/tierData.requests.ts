import { instanceAPI } from ".";

interface Tier {
  id: string;
  title: string;
  imageSrc?: string;
  genres?:string,
  platforms?:string,
  tags?:string,
}

interface UserTier {
  user_id: number;
  tier_id: number;
  rows: string;
}

export const getAllTiers = async (): Promise<Tier[]> => {
  const response = await instanceAPI.get("/tierlist");
  return response.data;
};

export const getTierById = async (id: number): Promise<Tier> => {
  const response = await instanceAPI.get(`/tierlist/${id}`);
  return response.data;
};

export const getUserTiers = async (userId: number): Promise<UserTier[]> => {
  const response = await instanceAPI.get(`/user/tierlists/${userId}`);
  return response.data;
};

export const getUserRows = async (userId: string, tierId: string) => {
  const response = await instanceAPI.get(`/user/rows/${userId}/${tierId}`);
  return response.data;
};

export const updateUserRows = async (userId: string, tierId: string, rows: any, token: string) => {
  const response = await instanceAPI.post(
    `/user/rows/${userId}/${tierId}`,
    { rows },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};