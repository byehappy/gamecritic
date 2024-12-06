import { Row } from "antd";
import React from "react";
import { CardGame } from "../card/CardGame";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { useAppSelector } from "../../redux/hooks";

interface CardListPorps {
  loading: boolean;
  pageSize: number
}

export const CardList: React.FC<CardListPorps> = ({  loading,pageSize = 40 }) => {
  const games = useAppSelector((state) => state.tierData.games)
  const { setNodeRef } = useDroppable({
    id: "tray",
  });
  return (
    <Row
      style={{
        display: "grid",
        gridTemplateColumns:" repeat(auto-fill, minmax(130px,1fr)",
        justifyItems:"center",
        gap:"1em"
      }} ref={setNodeRef}
    >
      {!games || loading
        ? SkeletonFactory(pageSize,"Card")
        : 
        <SortableContext strategy={rectSortingStrategy} items={!games ? [] : games}>
        {games.map((game) => (
              <CardGame key={game.id} game={game} id={game.id}/>
          ))}
    </SortableContext>
    }
    </Row>
  );
};
