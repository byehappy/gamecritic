import { Flex, Spin } from "antd";
import { Modal } from "../../modal/Modal";
import { LoadingOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { gameRequest } from "../../../axios/requests/games.requests";
import { useCallback, useEffect, useState } from "react";
import { IGameOnly } from "../../../interfaces/games";
import uuid4 from "uuid4";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMessage } from "../../../redux/slice/messageSlice";
import {
  addFavoriteGame,
  checkFavoriteGame,
  delFavoriteGame,
} from "../../../axios";
export const CardModal: React.FC<{
  id: number;
  setOpenModalGameId: (
    value: React.SetStateAction<number | string | null | undefined>
  ) => void;
}> = ({ id, setOpenModalGameId }) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<IGameOnly | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const checkFavorite = useCallback(async () => {
    if (currentUser !== null && game !== null) {
      try {
        await checkFavoriteGame(currentUser.id, game.id).then(() => {
          setIsFavorite(true);
        });
      } catch {
        setIsFavorite(false);
      }
    }
  }, [currentUser, game]);
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
  useEffect(() => {
    checkFavorite();
  }, [checkFavorite]);
  const addGameInFavorites = useCallback(async () => {
    if (currentUser && game) {
      try {
        await addFavoriteGame(currentUser?.id, game?.id);
        setIsFavorite(true);
      } catch (error) {
        dispatch(setMessage(error));
      }
    }
  }, [currentUser, dispatch, game]);
  const deleteGameFromFavorites = useCallback(async () => {
    if (currentUser && game) {
      try {
        await delFavoriteGame(currentUser?.id, game?.id);
        setIsFavorite(false);
      } catch (error) {
        dispatch(setMessage(error));
      }
    }
  }, [currentUser, dispatch, game]);

  const gameInfo = game ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "1vh 0" }}>
      <div style={{ display: "flex", gap: ".5vw" }}>
        {currentUser && isFavorite !== null &&
          (isFavorite ? (
            <StarFilled
              style={{ color: "#ffc400", fontSize: "1.5rem" }}
              onClick={() => deleteGameFromFavorites()}
            />
          ) : (
            <StarOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() => {
                addGameInFavorites();
              }}
            />
          ))}

        <h2>{game.name}</h2>
      </div>
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
    <Modal key={uuid4()} isOpen={true} onClose={() => setOpenModalGameId(null)}>
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
