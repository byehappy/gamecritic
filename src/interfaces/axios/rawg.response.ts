import { IGenres } from "../filters/genres";
import { ITags } from "../filters/tags";
import { IGame } from "../games";

export interface GetGames {
    count:number;
    results: IGame[]
}

export interface GetGenres {
    count:number;
    results: IGenres[]
}

export interface GetTags {
    count:number;
    results: ITags[]
}

interface IPlatforms {
    id:number;
    name:string;
    slug:string;
    image:string;
}

export interface GetPlatforms {
    count:number;
    results: IPlatforms[]
}
