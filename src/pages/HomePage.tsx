import { Carousel } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAllTiers } from "../axios";
import uuid4 from "uuid4";
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
  height: 20vh;
  padding: 0 1vw;
`;

const IntroText = styled.h1`
  display: flex;
  flex-direction: column;
  margin: 3vh 0;
  gap: 1vh;
  font-size: 1.8rem;
  p {
    font-weight: normal;
  }
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
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

export const HomePage = () => {
  const [tiers, setTiers] = useState<Tier[] | null>();
  const getTiersRef = useRef(false)
  const getTiers = useCallback(() => {
    getAllTiers()
      .then((res) => setTiers(res))
  }, []);

  useEffect(() => {
    if(getTiersRef.current) return;
    getTiersRef.current = true
    getTiers();
  }, [getTiers]);

  return (
    <>
      <IntroText>
        Оценивай игры с помощью градации в виде таблицы!
        <p>
          Выбери любой шаблон и выставляй игры от лучшего к худшему на свое
          усмотрение.
        </p>
      </IntroText>
      <div>
        <HeaderTemplate>
          <h1>Шаблоны по видеоиграм</h1>
          <Link to={"/all"}>Увидеть все шаблоны</Link>
        </HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false}>
          <div>
            <ContainerItems>
            {!tiers && SkeletonFactory(12,"Card")}
              {tiers?.map((tier) => (
                <TemplateCard
                  key={uuid4()}
                  img={tier.imageSrc ?? ""}
                  name={tier.title}
                  id={tier.id}
                />
              ))}
            </ContainerItems>
          </div>
          <div>
            <ContainerItems>
              
            </ContainerItems>
          </div>
        </CarouselWrapper>
      </div>
    </>
  );
};
