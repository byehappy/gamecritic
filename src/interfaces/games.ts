export interface IGame {
  background_image: string;
  name: string;
  id: number;
  short_screenshots: [
    {
      id: string;
      image: string;
    }
  ];
}

export interface IGameDis extends Omit<IGame, "id"> {
  id: number | string;
  disabled?: boolean;
}

export interface IGameOnly extends IGame {
  metacritic: string;
  released: string;
  updated: string;
  rating: string;
  playtime: string;
  description: string;
  website: string | undefined;
  platforms: {
    platform: { id: number; slug: string; name: string };
    released_at: string;
  }[];
  name_original: string;
  disabled: boolean;
}
