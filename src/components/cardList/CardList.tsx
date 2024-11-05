import { Row } from "antd";
import { IGameDis } from "../../interfaces/games";
import React from "react";
import { CardGame } from "../card/Card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

interface CardListPorps {
  games?: IGameDis[];
  loading: boolean;
  pageSize?: number
}

function generateArrayPlaceholderitems(count : number){
  return Array.from({length:count}, (_,index) => ({
    id: Date.now() + index
  }))
}

export const CardList: React.FC<CardListPorps> = ({ games, loading,pageSize = 40 }) => {
  const placeholderCards = generateArrayPlaceholderitems(pageSize)
  const { setNodeRef } = useDroppable({
    id: "tray",
  });
  return (
    <Row
      style={{
        display: "grid",
        gridTemplateColumns:" repeat(auto-fit, minmax(130px,1fr)",
        gap:"1rem"
      }} ref={setNodeRef}
    >
      {!games || loading
        ? placeholderCards.map((item) => (
              <CardGame key={item.id} loading={loading} id={item.id}/>
          ))
        : 
        <SortableContext strategy={rectSortingStrategy} items={!games ? placeholderCards : games}>
        {games.map((game) => (
              <CardGame key={game.id} game={game} loading={loading} id={game.id}/>
          ))}
    </SortableContext>
    }
    </Row>
  );
};
