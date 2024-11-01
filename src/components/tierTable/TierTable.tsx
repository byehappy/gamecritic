import { useDroppable } from "@dnd-kit/core";
import { CardGame } from "../Card/Card";
import { TierData } from "../../interfaces/tierData";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import styled from "styled-components";
import { Col, Flex, Spin } from "antd";
import {
  UpOutlined,
  DownOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { RowSettings } from "./rowSettings/RowSettings";

const DroppableWrapper = styled.div<{ $isOver: boolean }>`
  background-color: ${(props) =>
    props.$isOver ? "#e6f7ff" : "rgba(0, 0, 0,0.04)"};
  min-height: 12rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.55vh;
  width: 100%;
`;

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
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border: 1px solid black;
`;
const FilterRow = styled.div`
  background: #ff9f00;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 0.4vw;
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
  handleManipulatorTier: (index: number, direction?: "up" | "down",deleteTier?:boolean) => void;
  updateTier: (id: string, tierName?: string, color?: string, deleteGames?: boolean) => void;
  loading: boolean;
}> = ({ tierData, changeIndex, loading, handleManipulatorTier,updateTier }) => {
  const [isOpenTierId, setIsOpenTierId] = useState<string | null>();
  return loading ? (
    <Flex justify="center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </Flex>
  ) : (
    tierData.map((tier, index) => (
      <Container key={tier.id}>
        <RowHeader style={{ backgroundColor:tier.color }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              wordBreak: "break-all",
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
          <SettingOutlined
            style={{ fontSize: "3rem" }}
            onClick={() => setIsOpenTierId(tier.id)}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <UpOutlined
              style={{ fontSize: "2rem" }}
              onClick={() => changeIndex(index, "up")}
            />
            <DownOutlined
              style={{ fontSize: "2rem" }}
              onClick={() => changeIndex(index, "down")}
            />
          </div>
        </FilterRow>
        {isOpenTierId === tier.id ? (
          <RowSettings
            id={tier.id}
            index={index}
            isOpen={true}
            onClose={() => setIsOpenTierId(null)}
            tier={tier}
            handleManipulatorTier={handleManipulatorTier}
            updateTier={updateTier}
          />
        ) : null}
      </Container>
    ))
  );
};
