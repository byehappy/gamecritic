import { Row } from "antd";
import React from "react";
import { CardGame } from "../card/CardGame";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { useAppSelector } from "../../redux/hooks";
import styled from "styled-components";

interface CardListPorps {
  loading: boolean;
  pageSize: number;
}

const CardGameWrapper = styled.div`
  @media (max-width: 425px) {
    div {
      height: 6rem;
      img {
        height: 100%;
      }
    }
  }
`;
export const CardList: React.FC<CardListPorps> = ({
  loading,
  pageSize = 40,
}) => {
  const games = useAppSelector((state) => state.tierData.games);
  const { setNodeRef } = useDroppable({
    id: "tray",
  });
  return (
    <Row
      style={{
        display: "grid",
        gridTemplateColumns:
          " repeat(auto-fill, calc(80px + 50 * (100vw / 1280))",
        justifyContent: "space-between",
        justifyItems: "center",
        gap: "1em",
      }}
      ref={setNodeRef}
    >
      {!games || loading ? (
        SkeletonFactory(pageSize, "Card")
      ) : (
        <SortableContext
          strategy={rectSortingStrategy}
          items={!games ? [] : games}
        >
          {games.map((game) => (
            <CardGameWrapper key={game.id}>
              <CardGame game={game} id={game.id} />
            </CardGameWrapper>
          ))}
        </SortableContext>
      )}
    </Row>
  );
};
