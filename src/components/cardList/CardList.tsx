import { Row } from "antd";
import { IGame } from "../../interfaces/games";
import React from "react";
import { CardGame } from "../Card/Card";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

interface CardListPorps {
  games?: IGame[];
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
      gutter={[6, 16]}
      style={{
        marginTop: "2vh",
        display: "flex",
        justifyContent: "center",
      }}
      key="5" ref={setNodeRef}
    >
      {!games || loading
        ? placeholderCards.map((item) => (
              <CardGame key={item.id} loading id={item.id}/>
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
