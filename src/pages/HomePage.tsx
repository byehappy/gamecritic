import { Carousel } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const CarouselWrapper = styled(Carousel)`
  margin-top: 2vh;
  background-color: gray;
  padding: 0.3em;
`;
const ContainerItems = styled.div`
  display: flex;
  gap: 1vw;
  max-height: 20vh;
`;
const Item = styled(Link)`
  width: 8vw;
  position: relative;
  flex: none;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  span {
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
  }
`;

export const HomePage = () => {
  return (
    <>
      <h1>Игры по жанрам</h1>
      <CarouselWrapper arrows infinite={false}>
        <div>
          <ContainerItems className="aboba">
            <Item to="main">
              <img
                src="https://tiermaker.com/images/templates/1000-video-games-15303565/153035651681682831.png"
                alt="main"
              />
              <span>Все игры</span>
            </Item>
            <Item to="RPG">
              <img
                src="https://tiermaker.com/images/templates/best-rpg-games-of-all-time-1366519/13665191650477068.jpg"
                alt="rpg"
              />
              <span>Лучшее РПГ</span>
            </Item>
            <Item to="Singleplayer">
              <img
                src="https://tiermaker.com/images/templates/single-player-games-1081443/10814431624177063.jpg"
                alt="rpg"
              />
              <span>Лучшие одиночные игры</span>
            </Item>
          </ContainerItems>
        </div>
      </CarouselWrapper>
    </>
  );
};
