export {
  gamesRequest,
  gameRequest,
  tagsRequest,
  platformsRequest,
  genresRequest,
  gameScreenshots,
} from "./requests/games.requests";
export {
  signUp,
  signIn,
  logout,
  refreshToken,
} from "./requests/gamecriticAPI/auth.requests";
export {
  getAllTiers,
  getTierById,
  getUserRows,
  DeleteTier,
  getUserTiers,
  updateUserRows,
  getUsersTiers,
  UploadTier,
  getAuthorTiersSize,
  getAuthorTiers,
  UpdateTier,
  DeleteUserTier,
} from "./requests/gamecriticAPI/tierData.requests";
export {
  getFavoriteGames,
  addFavoriteGame,
  checkFavoriteGame,
  delFavoriteGame,
} from "./requests/gamecriticAPI/favorite.requests";
export {
  getUserInfo,
  uploadUserInfo,
  getAboutGame,
  getAllAboutGames,
  updateAboutGame,
  getTheSameUsers,
} from "./requests/gamecriticAPI/user.requests";
export {
  getPassedGame,
  addPassedGame,
  UnpassedGame,
  getTopUsers,
  getUserCount,
  getPassedGamesUser,
} from "./requests/gamecriticAPI/passGame.request";
export { getGamesOnIdsRequest,getGame } from "./requests/gamecriticAPI/games.request";
