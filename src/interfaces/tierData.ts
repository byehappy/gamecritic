import { IGameDis } from "./games";

export interface TierData {
    key:string;
    id:string;
    tier:string;
    games:IGameDis[];
}

export interface LocalTierData {
    key:string;
    id:string;
    tier:string;
    games:number[];
}

export interface InitTierData {
    rows:TierData[];
    tray:{
        games:IGameDis[]
    }
}