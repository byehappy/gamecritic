import { IGame } from "./games";

export interface TierData {
    key:string;
    id:string;
    tier:string;
    games:IGame[];
}

export interface InitTierData {
    rows:TierData[];
    tray:{
        games:IGame[]
    }
}