import axios from "axios";

const instanceGames = axios.create({
    baseURL:`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}`,
    params:{
        page_size: 32,
        search_exact:true,
        search_precise:false
    }
})

const instanceGenres = axios.create({
    baseURL:`https://api.rawg.io/api/genres?key=${import.meta.env.VITE_API_KEY}`,
})
const instanceTags = axios.create({
    baseURL:`https://api.rawg.io/api/tags?key=${import.meta.env.VITE_API_KEY}`,
})

export default {instanceGames,instanceGenres,instanceTags}