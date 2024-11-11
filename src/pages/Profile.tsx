import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { Carousel } from "antd";
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
  margin-top:1vw;
  a {
    font-size: 1.5em;
  }
`;
export const ProfilePage = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  if (!currentUser) {
    return <Navigate to="/auth/sign-in" />;
  }
  return (
    <div>
      <HeaderTemplate>
        <h1>Ваши шаблоны</h1>
        <Link to={"/all"}>Увидеть все шаблоны</Link>
      </HeaderTemplate>
      <CarouselWrapper arrows infinite={false} dots={false}>
        <div>
          <ContainerItems>
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
              }
              name={"Все игры"}
              slug={"main"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/best-rpg-games-of-all-time-1366519/13665191650477068.jpg"
              }
              name={"Лучшее РПГ"}
              slug={"RPG"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
              }
              name={"Лучшие одиночные игры"}
              slug={"Singleplayer"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
              }
              name={"Все игры"}
              slug={"main"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/best-rpg-games-of-all-time-1366519/13665191650477068.jpg"
              }
              name={"Лучшее РПГ"}
              slug={"RPG"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
              }
              name={"Лучшие одиночные игры"}
              slug={"Singleplayer"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
              }
              name={"Лучшие одиночные игры"}
              slug={"Singleplayer"}
            />
          </ContainerItems>
        </div>
        <div>
          <ContainerItems>
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
              }
              name={"Все игры"}
              slug={"main"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/best-rpg-games-of-all-time-1366519/13665191650477068.jpg"
              }
              name={"Лучшее РПГ"}
              slug={"RPG"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
              }
              name={"Лучшие одиночные игры"}
              slug={"Singleplayer"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
              }
              name={"Все игры"}
              slug={"main"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/best-rpg-games-of-all-time-1366519/13665191650477068.jpg"
              }
              name={"Лучшее РПГ"}
              slug={"RPG"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
              }
              name={"Лучшие одиночные игры"}
              slug={"Singleplayer"}
            />
            <TemplateCard
              img={
                "https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
              }
              name={"Все игры"}
              slug={"main"}
            />
          </ContainerItems>
        </div>
      </CarouselWrapper>
      <HeaderTemplate>
        <h1>Избранные игры</h1>
        <Link to={"/"}>Увидеть все избранные игры</Link>
      </HeaderTemplate>
    </div>
  );
};
