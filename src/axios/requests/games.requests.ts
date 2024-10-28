import axios from "axios"
import { FilterFlags } from "../../interfaces/filters"

const instanceRawg = axios.create({
    baseURL: "https://api.rawg.io/api",
    params:{
        key:import.meta.env.VITE_API_KEY
    }
})
export const gamesRequest = (params:FilterFlags) =>{
    return instanceRawg.get("/games",{
        params
    })
}
export const rawgRequest = (path:string) => {
    return instanceRawg.get(path)
}
