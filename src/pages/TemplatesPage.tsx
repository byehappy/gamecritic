import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { Item } from "../components/templateCard/TemplateCard.style";
import { useState, useCallback, useEffect } from "react";
import { getAllTiers } from "../axios";
import {
  getAuthorTiers,
  getUserTiers,
  Tier,
} from "../axios/requests/gamecriticAPI/tierData.requests";
import uuid4 from "uuid4";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { useParams } from "react-router-dom";

const TepmlatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(100px + 30 * (100vw / 1280)), 1fr));
  column-gap:1vw;
  row-gap:10px;
  height: 100%;
  padding: 0 1vw;
  ${Item}:hover {
    transform: scale(1.15, 1.15);
  }
`;

export const TemplatesPage: React.FC<{ author?: boolean }> = ({ author }) => {
  const { userid } = useParams() as {
    userid?: string;
  };
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const getTiers = useCallback(async () => {
    if (userid) {
      if (author) {
        const tiers = await getAuthorTiers(userid).then((res) => res.data);
        setTiers(tiers);
        setLoadingTiers(false);
        return;
      }
      await getUserTiers(userid)
        .then((res) => setTiers(res.data))
        .finally(() => setLoadingTiers(false));
    } else {
      getAllTiers()
        .then((res) => setTiers(res))
        .finally(() => setLoadingTiers(false));
    }
  }, [author, userid]);

  useEffect(() => {
    getTiers();
  }, [getTiers]);
  return (
    <>
      <h1 style={{ margin: "1vw 0" }}>Все шаблоны</h1>
      <TepmlatesContainer>
        {loadingTiers && SkeletonFactory(30, "Card")}
        {tiers?.map((tier) => (
          <TemplateCard
            key={uuid4()}
            img={tier.imageSrc ?? ""}
            name={tier.title}
            id={tier.id}
          />
        ))}
        {!loadingTiers && tiers.length === 0 && (
          <div style={{ fontSize: "1.2rem" }}>
            Вы еще не состовляли списки по шаблонам
          </div>
        )}
      </TepmlatesContainer>
    </>
  );
};
