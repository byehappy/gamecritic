import styled, { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button, Col, Row } from "antd";
import Search from "antd/es/input/Search";
import { FilterOutlined } from "@ant-design/icons";
import { CardGame } from "../../components/card/CardGame";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { getTextColor } from "../../utils/textColorWithBg";
import { useCallback, useEffect, useState } from "react";
import { IGame } from "../../interfaces/games";
import { gamesRequest, getGame } from "../../axios";
import { setMessage } from "../../redux/slice/messageSlice";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border: 1px solid black;
`;
const RowHeader = styled(Col)`
  display: flex;
  min-height: 9.5rem;
  width: calc(80px + 20 * (100vw / 1280));
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;
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
type FormValueType = {
  rows: {
    id: string;
    name: string;
    color: string;
  }[];
  name: string;
};

export const ExampleTierPage: React.FC<{
  formValues: FormValueType;
}> = ({ formValues: { rows, name } }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const createTemplate = useAppSelector((state) => state.createTemplate);
  const [games, setGames] = useState<IGame[] | undefined>();
  const getGames = useCallback(async () => {
    try {
      const filters: Record<string, string> = {};
      for (const key in createTemplate.filters) {
        if (createTemplate.filters[key].value) {
          filters[key] = createTemplate.filters[key].value;
        }
      }
      const res = await gamesRequest(filters).then((res) => res.data);
      setGames(res.results);
    } catch (error) {
      dispatch(setMessage({ error }));
    }
  }, [createTemplate.filters, dispatch]);
  const getGameFromCreate = useCallback(async () => {
    try {
      const games = await getGame(createTemplate.pickGame).then(
        (res) => res.data
      );
      setGames(games as IGame[]);
    } catch (error) {
      dispatch(setMessage({ error }));
    }
  }, [createTemplate.pickGame, dispatch]);

  useEffect(() => {
    if (createTemplate.pickGame.length !== 0) {
      getGameFromCreate();
    } else {
      getGames();
    }
  }, [createTemplate.pickGame.length, getGameFromCreate, getGames]);

  return (
    <>
      <h1
        style={{
          margin: "1vw 0",
          width: "100%",
          textAlign: "center",
          color: theme.colors.font,
        }}
      >
        {name}
      </h1>
      {rows.map((tier) => (
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
              <span
                style={{
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: "4",
                  color: getTextColor(tier.color),
                  overflow: "hidden",
                  padding: "0 1em",
                }}
              >
                {tier.name}
              </span>
            </div>
          </RowHeader>
        </Container>
      ))}
      <div
        style={{
          display: "flex",
          gap: "1vh",
          marginTop: "3vh",
          marginBottom: "1vh",
        }}
      >
        <Search
          placeholder="Введите название игры"
          enterButton="Поиск"
          size="large"
          disabled
        />
        <Button
          size="large"
          type="primary"
          icon={<FilterOutlined />}
          disabled
        />
      </div>
      <Row
        style={{
          display: "grid",
          gridTemplateColumns:
            " repeat(auto-fill, calc(80px + 50 * (100vw / 1280))",
          justifyContent: "space-between",
          justifyItems: "center",
          gap: "1em",
        }}
      >
        {!games
          ? SkeletonFactory(10, "Card")
          : games.map((game) => (
              <CardGameWrapper key={game.id}>
                <CardGame game={game} id={game.id} />
              </CardGameWrapper>
            ))}
      </Row>
    </>
  );
};
