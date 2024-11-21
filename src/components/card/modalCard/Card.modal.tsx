import { Flex, Spin, Tooltip } from "antd";
import { Modal } from "../../modal/Modal";
import { LoadingOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import {
  gameRequest,
  gameScreenshots,
} from "../../../axios/requests/games.requests";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { IGameOnly } from "../../../interfaces/games";
import uuid4 from "uuid4";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMessage } from "../../../redux/slice/messageSlice";
import {
  addFavoriteGame,
  checkFavoriteGame,
  delFavoriteGame,
} from "../../../axios";
import { platformIcons } from "../../../assets/icons/platfroms";
import { SliderContainer, SliderImage, DotsContainer, Dot } from "./card.style";

export const CardModal: React.FC<{
  id: number;
  setOpenModalGameId: (
    value: React.SetStateAction<number | string | null | undefined>
  ) => void;
}> = ({ id, setOpenModalGameId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<IGameOnly | null>(null);
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState<number | undefined>(0);
  const [screenshotsGame, setScreenshotsGame] =
    useState<[{ image: string; id: number }]>();
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
        const responseGame = await gameRequest(id);
        const responseScreenshot = await gameScreenshots(id);
        if (responseScreenshot.results)
          setScreenshotsGame(responseScreenshot.results);

        setGame(responseGame.data as IGameOnly);
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
    } else {
      dispatch(
        setMessage({
          message: "Для добавления в избранное необходимо авторизоваться",
        })
      );
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

  useEffect(() => {
    if (sliderRef.current && !loading) {
      const width = (sliderRef.current as HTMLElement).offsetWidth;
      setSliderWidth(width);
    }
    const handleResize = () => {
      if (sliderRef.current) {
        const width = (sliderRef.current as HTMLElement).offsetWidth;
        setSliderWidth(width);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [loading]);

  const handleMouseMove = (event: any) => {
    if (!screenshotsGame) return;
    if (!sliderWidth) return;
    const rect = event.target.getBoundingClientRect();

    const sectionWidth = sliderWidth / screenshotsGame.length;
    const deltaX = event.clientX - rect.left;
    let currentIndex = Math.floor(deltaX / sectionWidth);
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= screenshotsGame.length)
      currentIndex = screenshotsGame.length - 1;

    setCurrentImageIndex(currentIndex);
  };
  const gameInfo = game ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "1vh 0" }}>
      {screenshotsGame && (
        <div style={{ position: "relative" }}>
          <SliderContainer onMouseMove={handleMouseMove} ref={sliderRef}>
            <SliderImage
              src={screenshotsGame[currentImageIndex].image}
              alt={`Скриншот ${currentImageIndex + 1}`}
            />
          </SliderContainer>
          <DotsContainer>
            {screenshotsGame.map((_, index) => (
              <Dot key={uuid4()} $isActive={index === currentImageIndex} />
            ))}
          </DotsContainer>
        </div>
      )}
      <div style={{ display: "flex", gap: ".5vw" }}>
        {isFavorite ? (
          <Tooltip title="Удалить из избранного">
            <StarFilled
              style={{ color: "#ffc400", fontSize: "1.5rem" }}
              onClick={() => deleteGameFromFavorites()}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Доавить в избранное">
            <StarOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() => {
                addGameInFavorites();
              }}
            />
          </Tooltip>
        )}
        <h2>{game.name}</h2>
      </div>
      <p>
        <strong>Оценка на Metacritic:</strong> {game.metacritic}
      </p>
      <p>
        <strong>Дата релиза:</strong>{" "}
        {new Date(game.released).toLocaleString().split(",")[0]}
      </p>
      <p>
        <strong>Последнее обновление:</strong>{" "}
        {new Date(game.updated).toLocaleString().split(",")[0]}
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
          <ul style={{ listStyle: "none" }}>
            {game.platforms.map((platform) => (
              <li key={uuid4()} style={{ display: "flex", gap: "1vw" }}>
                <span>
                  {createElement(
                    platformIcons[
                      platform.platform.name as keyof typeof platformIcons
                    ] || platformIcons.Global
                  )}
                </span>
                {platform.platform.name} -
                {new Date(platform.released_at).toLocaleString().split(",")[0]}
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
