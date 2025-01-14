export interface IGame {
  background_image: string;
  name: string;
  id: number;
}

export interface IGameDis extends Omit<IGame, "id"> {
  id: number | string;
  disabled?: boolean;
}

export interface IGameOnly extends IGame {
  parent_platforms: [{platform:{name:string,slug:string}}];
  metacritic: string;
  released: string;
  updated: string;
  rating: number;
  playtime: string;
  description_raw: string;
  website: string | undefined;
  platforms: {
    platform: { id: number; slug: string; name: string };
    released_at: string;
  }[];
  name_original: string;
  disabled: boolean;
}
