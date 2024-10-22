import { Row, Col, Card } from "antd";
import { IGame } from "../../interfaces/games";
import React from "react";

interface CardListPorps {
  games?: IGame[];
  loading: boolean;
}

export const CardList: React.FC<CardListPorps> = ({ games, loading }) => {
  const placeholderCards = new Array(6).fill(null);

  return (
    <Row
      gutter={[6, 16]}
      style={{
        marginTop: "2vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {!games || loading
        ? placeholderCards.map((_, index) => (
            <Col key={index}>
              <Card
                loading={loading}
                style={{ width: 150, overflow: "hidden", minHeight:"9.5rem" }}
                styles={{
                  body: {
                    display: "none",
                  },
                }}
              />
            </Col>
          ))
        : games.map((game) => (
            <Col key={game.id}>
              <Card
                loading={loading}
                style={{ width: 150, overflow: "hidden", }}
                styles={{
                  body: {
                    display: "none",
                  },
                }}
                hoverable
                cover={
                  <img
                    height={"150rem"}
                    alt={game.name}
                    src={game.background_image}
                  />
                }
              />
            </Col>
          ))}
    </Row>
  );
};
