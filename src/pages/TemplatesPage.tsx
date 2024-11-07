import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { Item } from "../components/templateCard/TemplateCard.style";

const TepmlatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px,1fr));
  gap:1rem;
  grid-template-rows:repeat(auto-fit, 20vh);
  ${Item}:hover{
    transform:scale(1.15,1.15);
  }
`;

export const TemplatesPage = () => {
  return (
    <>
      <h1 style={{margin:"1vw 0"}}>Все шаблоны</h1>
      <TepmlatesContainer>
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

      </TepmlatesContainer>
    </>
  );
};
