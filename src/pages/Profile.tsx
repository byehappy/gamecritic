import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { getPreviewFavoriteGames, getUserTiers } from "../axios";
import uuid4 from "uuid4";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { setMessage } from "../redux/slice/messageSlice";
import { IGame } from "../interfaces/games";
import { gameRequest } from "../axios/requests/games.requests";
import { CardGame } from "../components/card/CardGame";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import {
  getAuthorTiersSize,
  Tier,
} from "../axios/requests/gamecriticAPI/tierData.requests";

const ContainerItems = styled.div`
  display: flex;
  gap: 15px;
  padding: 0 1vw;
  overflow-x: overlay;
  min-height: 170px;
  padding: 0 1vw;
  margin: 17px 0;
  span {
    overflow: hidden;
  }
  div {
    min-width: calc(100px + 30 * (100vw / 1280));
    max-width: 130px;
    touch-action: auto;
  }
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.adaptivText};
  margin-top: 1vw;
  a {
    font-size: ${({ theme }) => theme.fontSizes.adaptivSmallText};
    font-weight: 300;
    text-align: right;
    @media (max-width: 425px) {
      width: 35vw;
    }
    text-decoration:underline;
  }
  h4 {
    @media (max-width: 425px) {
      width: 35vw;
    }
  }
`;
export const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const profileUserId = userId ?? currentUser?.id;
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [myTiers, setMyTiers] = useState<Tier[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<IGame[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const getTiers = useCallback(async () => {
    const tiers = await getUserTiers(profileUserId!).then((res) => res.data);
    const authorTiers = await getAuthorTiersSize(profileUserId!, 12).then(
      (res) => res.data
    );
    setTiers(tiers);
    setMyTiers(authorTiers);
    setLoadingTiers(false);
  }, [profileUserId]);

  useEffect(() => {
    if (!profileUserId) {
      dispatch(setMessage({ error: "Профиль не найден" }));
      navigation("/");
      return;
    }
    getTiers();
  }, [currentUser, dispatch, getTiers, navigation, profileUserId]);
  const fillFavoriteGames = useCallback(async () => {
    if (profileUserId) {
      try {
        const gameIds = await getPreviewFavoriteGames(profileUserId).then(
          (res) => res.data
        );
        if (!gameIds) {
          setLoadingFavorites(false);
          return;
        }
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
  }, [dispatch, profileUserId]);
  useEffect(() => {
    fillFavoriteGames();
  }, [fillFavoriteGames]);

  return (
    <div>
      <HeaderTemplate>
        <h4>Ваши шаблоны</h4>
        {myTiers.length !== 0 && (
          <Link to={`/all-my-tierlits/${profileUserId}`}>
            Увидеть все свои шаблоны
          </Link>
        )}
      </HeaderTemplate>

      <ContainerItems>
        {loadingTiers && SkeletonFactory(10, "Template")}
        {myTiers.map((tier) => {
          const id = uuid4();
          return (
            <TemplateCard
              key={id}
              img={tier.imageSrc ?? ""}
              name={tier.title}
              id={tier.id}
              userId={profileUserId}
            />
          );
        })}
        {!loadingTiers && myTiers.length === 0 && (
          <span style={{ fontSize: "1.2rem" }}>
            У вас нет созданных шаблонов
          </span>
        )}
      </ContainerItems>
      <HeaderTemplate></HeaderTemplate>
      <HeaderTemplate>
        <h4> Используемые шаблоны</h4>
        {tiers.length !== 0 && (
          <Link to={`/all-tierlits/${profileUserId}`}>Увидеть все шаблоны</Link>
        )}
      </HeaderTemplate>

      <ContainerItems>
        {loadingTiers && SkeletonFactory(10, "Template")}
        {tiers.map((tier) => {
          const id = uuid4();
          return (
            <TemplateCard
              key={id}
              img={tier.imageSrc ?? ""}
              name={tier.title}
              id={tier.id}
              userId={profileUserId}
            />
          );
        })}
        {!loadingTiers && tiers.length === 0 && (
          <span style={{ fontSize: "1.2rem" }}>
            Вы еще не состовляли списки по шаблонам
          </span>
        )}
      </ContainerItems>

      <HeaderTemplate>
        <h4> Избранные игры</h4>
        {favoriteGames.length !== 0 && (
          <Link to={`/all-favorites/${profileUserId}`}>
            Увидеть все избранные игры
          </Link>
        )}
      </HeaderTemplate>
      <ContainerItems>
        {loadingFavorites && SkeletonFactory(8, "Card")}
        {favoriteGames.map((game) => {
          return <CardGame key={game.id} game={game} id={game.id} />;
        })}
        {!loadingFavorites && favoriteGames.length === 0 && (
          <span style={{ fontSize: "1.2rem" }}>
            Вы не добавили игры в избранное
          </span>
        )}
      </ContainerItems>
    </div>
  );
};
