import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { Carousel } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getTierById, getUserTiers } from "../axios";
import uuid4 from "uuid4";
import { TemplateCard } from "../components/templateCard/TemplateCard";
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
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<[]>([]);
  const getTiers = useCallback(async () => {
    if (!currentUser) return;
    const tierIds = await getUserTiers(currentUser.id);
    const tiers = tierIds.map((tier) => getTierById(tier.tier_id));
    setTiers(await Promise.all(tiers));
  }, [currentUser]);

  useEffect(() => {
    getTiers();
  }, [getTiers]);

  if (!currentUser) {
    return <Navigate to="/auth/sign-in" />;
  }
  return (
    <div>
      <HeaderTemplate>
        <h1>Ваши шаблоны</h1>
        {tiers.length !== 0 && <Link to={"/all"}>Увидеть все шаблоны</Link>}
      </HeaderTemplate>
      <CarouselWrapper arrows infinite={false} dots={false}>
        <div>
          <ContainerItems>
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
            {tiers.length === 0 && (
              <div style={{ fontSize: "1.2rem" }}>
                Вы еще не состовляли списки по шаблонам
              </div>
            )}
          </ContainerItems>
        </div>
      </CarouselWrapper>
      <HeaderTemplate>
        <h1>Избранные игры</h1>
        {favoriteGames.length !== 0 && <Link to={"/"}>Увидеть все избранные игры</Link>}
      </HeaderTemplate>
      <CarouselWrapper arrows infinite={false} dots={false}>
        <div>
          <ContainerItems>
            {/* {favoriteGames.map((game) => {
              const id = uuid4();
              return (
                <TemplateCard
                  key={id}
                  img={game.imageSrc ?? ""}
                  name={game.title}
                  id={game.id}
                />
              );
            })} */}
            {favoriteGames.length === 0 && (
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
