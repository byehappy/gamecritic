import axios from "axios";

const instance = axios.create({
    baseURL:`https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}`,
    params:{
        page_size: 32,
        search_exact:true,
        search_precise:false
    }
})

export default instance