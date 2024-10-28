import { useDroppable } from "@dnd-kit/core";
import useToken from "antd/es/theme/useToken";
import { CardGame } from "../Card/Card";
import { TierData } from "../../interfaces/tierData";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import styled from "styled-components";
import { Col } from "antd";

const DroppableCell: React.FC<{ id: string; children?: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const token = useToken();

  const style = {
    backgroundColor: isOver ? "#e6f7ff" : token[1].colorBgTextActive,
    minHeight: "12rem",
    display: "flex",
    flexWrap: "wrap",
    width:"100%",
    gap:".5vh .5vh"
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  width: "100%",
  border: "1px solid black",
};
const RowHeader = styled(Col)`
  display: flex;
  min-height:9.5rem;
  width:10vw;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

export const TierTable: React.FC<{ tierData: TierData[] }> = ({ tierData }) => {
  const token = useToken();

  return tierData.map((tier) => (
    <div style={containerStyle} key={tier.id}>
      <RowHeader style={{ backgroundColor: token[1].blue }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            wordBreak: "break-word",
          }}
        >
          <span style={{ textAlign: "center", display: "inline-block" }}>
            {tier.tier}
          </span>
        </div>
      </RowHeader>
      <SortableContext items={tier.games} strategy={rectSortingStrategy}>
        <DroppableCell id={tier.id}>
          {tier.games.map((game) => {
            return (
              <CardGame
                key={game.id}
                game={game}
                loading={false}
                id={game.id}
              />
            );
          })}
        </DroppableCell>
      </SortableContext>
    </div>
  ))
};
