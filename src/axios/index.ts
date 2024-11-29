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
} from "./requests/gamecriticAPI/tierData.requests";
export {
  getFavoriteGames,
  addFavoriteGame,
  checkFavoriteGame,
  delFavoriteGame,
} from "./requests/gamecriticAPI/favorite.requests";
export { getUserInfo,uploadUserInfo } from "./requests/gamecriticAPI/user.requests";
