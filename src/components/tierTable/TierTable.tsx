import { useDroppable } from "@dnd-kit/core";
import { CardGame } from "../card/CardGame";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import styled, { useTheme } from "styled-components";
import { Col, Tooltip, Typography } from "antd";
import { UpOutlined, DownOutlined, SettingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { RowSettings } from "./rowSettings/RowSettings";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setRows } from "../../redux/slice/tierDataSlice";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { getTextColor } from "../../utils/textColorWithBg";
import { device } from "../../styles/size";

const DroppableWrapper = styled.div<{ $isOver: boolean }>`
  background-color: ${(props) =>
    props.$isOver ? "#dfdfdf" : "rgba(0, 0, 0,0.04)"};
  min-height: 12rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(80px + 48 * (100vw / 1280)));
  gap: 0.5vh;
  flex: 1;
  @media (max-width: 425px) {
    div {
      height: 6rem;
      img {
        height: 100%;
      }
    }
  }
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
  @media ${device.mobileS} {
    flex-direction: column;
  }
  @media ${device.tablet} {
    flex-direction: row;
  }
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 0.4vw;
  gap: 2%;
  min-width: 30px;
  max-width: 90px;
  span {
    transition: opacity 0.3s ease-in-out;
  }
  span:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;
const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  "-webkit-line-clamp": "4",
  "-webkit-box-orient": "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
const RowHeader = styled(Col)`
  display: flex;
  min-height: 9.5rem;
  width: calc(80px + 20 * (100vw / 1280));
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;
export const TierTable: React.FC<{
  loading: boolean;
}> = ({ loading }) => {
  const theme = useTheme();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [isOpenTierId, setIsOpenTierId] = useState<string | null>();
  const rowsData = useAppSelector((state) => state.tierData.rows);
  const dispatch = useAppDispatch();
  const changeIndex = (index: number, direction: "up" | "down") => {
    const newTierData = [...rowsData];

    if (direction === "up" && index > 0) {
      [newTierData[index - 1], newTierData[index]] = [
        newTierData[index],
        newTierData[index - 1],
      ];
    } else if (direction === "down" && index < rowsData.length - 1) {
      [newTierData[index + 1], newTierData[index]] = [
        newTierData[index],
        newTierData[index + 1],
      ];
    }
    dispatch(setRows(newTierData));
  };
  return loading
    ? SkeletonFactory(5, "Table")
    : rowsData.map((tier, index) => {
        return (
          <Container key={tier.id} id={tier.id}>
            <RowHeader style={{ backgroundColor: tier.color }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  wordBreak: "break-all",
                }}
              >
                <CustomSpan name={tier.name} color={tier.color} />
              </div>
            </RowHeader>
            <SortableContext items={tier.games} strategy={rectSortingStrategy}>
              <DroppableCell id={tier.id}>
                {tier.games.map((game) => {
                  return <CardGame key={game.id} game={game} id={game.id} />;
                })}
              </DroppableCell>
            </SortableContext>
            {currentUser && (
              <FilterRow>
                <SettingOutlined
                  style={{ fontSize: theme.fontSizes.adaptivText }}
                  onClick={() => setIsOpenTierId(tier.id)}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <UpOutlined
                    style={{ fontSize: theme.fontSizes.adaptivText }}
                    onClick={() => changeIndex(index, "up")}
                  />
                  <DownOutlined
                    style={{ fontSize: theme.fontSizes.adaptivText }}
                    onClick={() => changeIndex(index, "down")}
                  />
                </div>
              </FilterRow>
            )}
            {isOpenTierId === tier.id ? (
              <RowSettings
                id={tier.id}
                index={index}
                isOpen={true}
                onClose={() => setIsOpenTierId(null)}
                tier={tier}
              />
            ) : null}
          </Container>
        );
      });
};

const CustomSpan = ({ name, color }: { name: string; color: string }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  useEffect(() => {
    if (spanRef.current) {
      const { offsetHeight, scrollHeight } = spanRef.current;
      setIsOverflow(offsetHeight < scrollHeight);
    }
  }, [name]);
  return (
    <StyledTypography
      style={{
        textAlign: "center",
        color: getTextColor(color),
        padding: "0 1em",
      }}
      ref={spanRef}
    >
      {spanRef.current && isOverflow ? (
        <Tooltip title={name}>
          <span style={{ height: "9vh", display: "block" }}>{name}</span>
        </Tooltip>
      ) : (
        name
      )}
    </StyledTypography>
  );
};
