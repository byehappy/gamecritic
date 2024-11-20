import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { Carousel } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getFavoriteGames, getUserTiers } from "../axios";
import uuid4 from "uuid4";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { setMessage } from "../redux/slice/messageSlice";
import { IGame } from "../interfaces/games";
import { gameRequest } from "../axios/requests/games.requests";
import { CardGame } from "../components/card/Card";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
const CarouselWrapper = styled(Carousel)`
  margin-top: 2vh;
  padding: 0.3em;
  button.slick-arrow {
    color: black;
  }
`;
const ContainerItems = styled.div`
  display: flex;
  gap: 1vw;
  max-height: 20vh;
  padding: 0 1vw;
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 1vw;
  a {
    font-size: 1.5em;
  }
`;

interface Tier {
  id: string;
  title: string;
  imageSrc?: string;
  genres?: string;
  platforms?: string;
  tags?: string;
}
export const ProfilePage = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<IGame[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const getTiers = useCallback(async () => {
    if (!currentUser) {
      dispatch(setMessage({ error: "Вы не авторизованны" }));
      navigation("/");
      return;
    }
    const tiers = await getUserTiers(currentUser.id).then((res) => res.data);
    setTiers(tiers);
    setLoadingTiers(false);
  }, [currentUser, dispatch, navigation]);

  useEffect(() => {
    getTiers();
  }, [getTiers]);
  const fillFavoriteGames = useCallback(async () => {
    if (currentUser) {
      try {
        const jsonGameIds = await getFavoriteGames(currentUser.id).then(
          (res) => res.data.game_ids
        );
        if (!jsonGameIds) {
          setLoadingFavorites(false);
          return;
        }
        const gameIds:string[] = JSON.parse(jsonGameIds);
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
    }
  }, [currentUser, dispatch]);
  useEffect(() => {
    fillFavoriteGames();
  }, [fillFavoriteGames]);

  return (
    <div>
      <HeaderTemplate>
        <h1>Ваши шаблоны</h1>
        {tiers.length !== 0 && <Link to={`/all-tierlits/${currentUser?.id}`}>Увидеть все шаблоны</Link>}
      </HeaderTemplate>
      <CarouselWrapper arrows infinite={false} dots={false}>
        <div>
          <ContainerItems>
            {loadingTiers && SkeletonFactory(10, "Card")}
            {tiers.map((tier) => {
              const id = uuid4();
              return (
                <TemplateCard
                  key={id}
                  img={tier.imageSrc ?? ""}
                  name={tier.title}
                  id={tier.id}
                />
              );
            })}
            {!loadingTiers && tiers.length === 0 && (
              <div style={{ fontSize: "1.2rem" }}>
                Вы еще не состовляли списки по шаблонам
              </div>
            )}
          </ContainerItems>
        </div>
      </CarouselWrapper>
      <HeaderTemplate>
        <h1>Избранные игры</h1>
        {favoriteGames.length !== 0 && (
          <Link to={`/all-favorites/${currentUser?.id}`}>Увидеть все избранные игры</Link>
        )}
      </HeaderTemplate>
      <CarouselWrapper arrows infinite={false} dots={false}>
        <div>
          <ContainerItems>
            {loadingFavorites && SkeletonFactory(10, "Card")}
            {favoriteGames.map((game) => {
              return <CardGame key={game.id} game={game} id={game.id} />;
            })}
            {!loadingFavorites && favoriteGames.length === 0 && (
              <div style={{ fontSize: "1.2rem" }}>
                Вы не добавили игры в избранное
              </div>
            )}
          </ContainerItems>
        </div>
      </CarouselWrapper>
    </div>
  );
};
