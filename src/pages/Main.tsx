import { useEffect, useState } from "react";
import instance from "../axios";
import { Card, Col, Row } from "antd";
import { IGame } from "../interfaces/games";

function MainPage() {
  const [games, setGames] = useState<IGame[]>();

  useEffect(() => {
    instance.get("").then((res) => setGames(res.data.results));
    console.log(games );
    
  }, []);

  return (
    <>
      {!games || games.length === 0 ? (
        <p>Нет данных</p>
      ) : (
        <Row gutter={[6, 16]}>
          {games.map((game) => (
            <Col  key={game.id}>
              <Card
                style={{ width: 150,overflow:"hidden" }}
                styles={{body:{
                    display:"none"
                }}}
                hoverable
                cover={<img height={"150rem"} alt={game.name} src={game.background_image} />}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default MainPage;
