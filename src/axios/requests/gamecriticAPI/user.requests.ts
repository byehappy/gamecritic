import { instanceAPI } from ".";

export const getUserInfo = async (id: string) => {
  return instanceAPI.get(`/user/info/${id}`);
};
export const uploadUserInfo = async (
  id: string,
  update: { name?: string; about_text?: string; img_icon?: string }
) => {
  return instanceAPI.patch(`/user/info/${id}`, { update });
};
