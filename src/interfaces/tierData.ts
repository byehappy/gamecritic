import { IGameDis } from "./games";

export interface TierData {
    key:string;
    id:string;
    tier:string;
    games:IGameDis[];
    color:string;
}

export interface LocalTierData {
    key:string;
    id:string;
    tier:string;
    games:number[];
    color:string;
}

export interface InitTierData {
    rows:TierData[];
    tray:{
        games:IGameDis[]
    }
}