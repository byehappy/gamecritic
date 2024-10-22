export interface IGame {
    background_image: string;
    name: string;
    id: number;
    short_screenshots:[{
      id:string;
      image:string;
    }]
  }