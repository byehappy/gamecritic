export interface IGame {
    background_image: string;
    name: string;
    id: string | number;
    short_screenshots:[{
      id:string;
      image:string;
    }]
  }

  export interface IGameDis extends IGame {
    disabled:boolean
  }