import axios from "axios"
import { FilterFlags } from "../../interfaces/filters"
import { GetGames, GetGenres, GetPlatforms, GetTags } from "../../interfaces/axios/rawg.response"
import { IGameDis, IGameOnly } from "../../interfaces/games"

const instanceRawg = axios.create({
    baseURL: "https://api.rawg.io/api",
    params:{
        key:import.meta.env.VITE_API_KEY
    }
})
export const gamesRequest = (params:FilterFlags) =>{
    return instanceRawg.get<GetGames>("/games",{
        params
    })
}

export const gameRequest = (id:number) =>{
    return instanceRawg.get<IGameOnly | IGameDis>(`/games/${id}`)
}

export const tagsRequest = () =>{
    return instanceRawg.get<GetTags>("/tags")
}

export const genresRequest = () =>{
    return instanceRawg.get<GetGenres>("/genres")
}
export const platformsRequest = () =>{
    return instanceRawg.get<GetPlatforms>("/platforms")
}
