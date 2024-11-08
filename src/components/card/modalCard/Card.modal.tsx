import { Flex, Spin } from "antd";
import { Modal } from "../../modal/Modal";
import { LoadingOutlined } from "@ant-design/icons";
import { gameRequest } from "../../../axios/requests/games.requests";
import { useEffect, useState } from "react";
import { IGameOnly } from "../../../interfaces/games";
import uuid4 from "uuid4";
export const CardModal: React.FC<{
  id: number;
  setOpenModalGameId: (
    value: React.SetStateAction<number | string | null | undefined>
  ) => void;
}> = ({ id, setOpenModalGameId }) => {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<IGameOnly | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const response = await gameRequest(id);
        setGame(response.data as IGameOnly);
      } catch (error) {
        console.error("Ошибка при получении данных об игре:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const gameInfo = game ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "1vh 0" }}>
      <h2>{game.name}</h2>
      <p>
        <strong>Оценка на Metacritic:</strong> {game.metacritic}
      </p>
      <p>
        <strong>Дата релиза:</strong> {game.released}
      </p>
      <p>
        <strong>Последнее обновление:</strong>{" "}
        {new Date(game.updated).toLocaleString()}
      </p>
      <p>
        <strong>Рейтинг:</strong> {game.rating}
      </p>
      <p>
        <strong>Среднее время игры:</strong> {game.playtime} hours
      </p>
      <p>
        <strong>Описание:</strong>{" "}
        <span dangerouslySetInnerHTML={{ __html: game.description }}></span>
      </p>
      {game.platforms && (
        <div>
          <h3>Платформы:</h3>
          <ul style={{ paddingLeft: "1vw" }}>
            {game.platforms.map((platform) => (
              <li key={uuid4()}>
                {platform.platform.name} - {platform.released_at}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <p>Не удалось загрузить данные об игре.</p>
  );

  return (
    <Modal
      key={uuid4()}
      isOpen={true}
      onClose={() => setOpenModalGameId(null)}
    >
      {loading ? (
        <Flex justify="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      ) : (
        gameInfo
      )}
    </Modal>
  );
};
