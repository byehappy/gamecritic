import { IGame, IGameDis } from "./games";

export interface TierData {
    id:string;
    tier:string;
    games:IGame[];
    color:string;
}

export interface SaveTierData {
    id:string;
    tier:string;
    games:number[];
    color:string;
}

export interface InitTierData {
    rows:TierData[];
    games:IGameDis[]
}