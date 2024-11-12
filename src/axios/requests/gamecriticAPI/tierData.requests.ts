import { instanceAPI } from ".";

interface Tier {
  id: string;
  title: string;
  imageSrc?: string;
  genres?:string,
  platforms?:string,
  tags?:string,
}
let currentAbortController: AbortController | null = null;

export const getAllTiers = async (): Promise<Tier[]> => {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  const response = await instanceAPI.get("/tierlist",{signal:currentAbortController.signal});
  currentAbortController = null
  return response.data;
};

export const getTierById = async (id: string) => {
  const response = await instanceAPI.get(`/tierlist/${id}`);
  return response.data;
};

export const getUserTiers = async (userId: string): Promise<{tier_id:string}[]> => {
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