export {gamesRequest, tagsRequest,platformsRequest,genresRequest} from "./requests/games.requests"
export {signUp,signIn,logout,refreshToken} from "./requests/gamecriticAPI/auth.requests"
export {getAllTiers,getTierById,getUserRows,getUserTiers,updateUserRows} from "./requests/gamecriticAPI/tierData.requests"
export {getFavoriteGames,addFavoriteGame,checkFavoriteGame,delFavoriteGame} from "./requests/gamecriticAPI/favorite.requests"
