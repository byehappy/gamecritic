import { FilterTierValue } from "./filters";
import { IGame, IGameDis } from "./games";

export interface TierData {
    id:string;
    name:string;
    games:IGame[];
    color:string;
}

export interface SaveTierData {
    id:string;
    name:string;
    games:number[];
    color:string;
}

export interface InitTierData {
    rows:TierData[];
    games:IGameDis[]
    filters:FilterTierValue;
}