import axios from "axios";

const instance = axios.create({
    baseURL:`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}`
})

export default instance