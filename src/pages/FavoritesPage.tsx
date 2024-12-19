import styled, { useTheme } from "styled-components";
import { Item } from "../components/templateCard/TemplateCard.style";
import { useState, useCallback, useEffect } from "react";
import {  getFavoriteGames } from "../axios";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { useParams } from "react-router-dom";
import { gameRequest } from "../axios/requests/games.requests";
import { IGame } from "../interfaces/games";
import { setMessage } from "../redux/slice/messageSlice";
import { CardGame } from "../components/card/CardGame";
import { useAppDispatch } from "../redux/hooks";

const TepmlatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100px + 30 * (100vw / 1280)), 1fr));
  gap:10px;
  height: 100%;
  padding: 0 1vw;
  ${Item}:hover {
    transform: scale(1.15, 1.15);
  }
`;

export const FavoritesPage = () => {
  const theme = useTheme()
  const { userid } = useParams() as {
    userid: string;
  };
  const [favoriteGames, setFavoriteGames] = useState<IGame[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const dispatch = useAppDispatch();
  const fillFavoriteGames = useCallback(async () => {
      try {
        const jsonGameIds = await getFavoriteGames(userid).then(
          (res) => res.data.game_ids
        );
        if (!jsonGameIds) {
          setLoadingFavorites(false);
          return;
        }
        const gameIds: string[] = JSON.parse(jsonGameIds);
        const gameRequests = gameIds.map((id) =>
          gameRequest(Number(id)).then((res) => res.data)
        );
        const gamesData = await Promise.all(gameRequests);
        setFavoriteGames(gamesData);
        setLoadingFavorites(false);
      } catch (error) {
        dispatch(
          setMessage({
            error: `Не удалось получить игры из избранного:${error}`,
          })
        );
    }
  }, [dispatch, userid]);
  useEffect(() => {
    fillFavoriteGames();
  }, [fillFavoriteGames]);

  return (
    <>
      <h1 style={{ margin: "1vw 0",fontSize:theme.fontSizes.adaptivH1 }}>Все избранные игры</h1>
      <TepmlatesContainer>
        {loadingFavorites && SkeletonFactory(10, "Card")}
        {favoriteGames.map((game) => {
          return <CardGame key={game.id} game={game} id={game.id} />;
        })}
        {!loadingFavorites && favoriteGames.length === 0 && (
          <div style={{ fontSize: "1.2rem" }}>
            Вы не добавили игры в избранное
          </div>
        )}
      </TepmlatesContainer>
    </>
  );
};
