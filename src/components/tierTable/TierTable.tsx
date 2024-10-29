import { useDroppable } from "@dnd-kit/core";
import useToken from "antd/es/theme/useToken";
import { CardGame } from "../Card/Card";
import { TierData } from "../../interfaces/tierData";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import styled from "styled-components";
import { Col } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const DroppableWrapper = styled.div<{$isOver:boolean}>`
background-color: ${props => props.$isOver ? "#e6f7ff" : "rgba(0, 0, 0,0.04)"};
min-height: 12rem;
display: flex;
flex-wrap: wrap;
width: 100%;
gap: .5vh;
`

const DroppableCell: React.FC<{ id: string; children?: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });


  return (
    <DroppableWrapper $isOver={isOver} ref={setNodeRef}>
      {children}
    </DroppableWrapper>
  );
};

const Container = styled.div`
    display: flex;
  flex-direction:row;
  align-items: stretch;
  width: 100%;
  border: 1px solid black;
`
const FilterRow = styled.div`
  background: #ff9f00;
  width: 8vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  gap: 1vw;
  span {
    transition: opacity 0.3s ease-in-out;
  }
  span:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;
const RowHeader = styled(Col)`
  display: flex;
  min-height: 9.5rem;
  width: 10vw;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

export const TierTable: React.FC<{
  tierData: TierData[];
  changeIndex: (index: number, direction: "up" | "down") => void;
}> = ({ tierData,changeIndex }) => {
  const token = useToken();
  

  return tierData.map((tier,index) => (
    <Container key={tier.id}>
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
      <FilterRow>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <UpOutlined style={{ fontSize: "2rem" }} onClick={()=>changeIndex(index,"up")}/>
          <DownOutlined style={{ fontSize: "2rem" }} onClick={()=>changeIndex(index,"down")}/>
        </div>
      </FilterRow>
    </Container>
  ));
};
