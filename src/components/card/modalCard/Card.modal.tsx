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
import { useWordDeclination } from "../../../utils/hooks/useWorldDeclination";

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
  const textHoursPlay = useWordDeclination(Number(game?.playtime), [
    "час",
    "часа",
    "часов",
  ]).text;
  const textMetacritic = useWordDeclination(Number(game?.metacritic), [
    "балл",
    "балла",
    "баллов",
  ]).text;
  const gameInfo = game ? (
    <div>
      <h1 style={{ textWrap: "nowrap" }}>
        {game.name}{" "}
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
      </h1>
      <div style={{ width: "min-content", display: "flex", gap: "1vw" }}>
        <div>
          {screenshotsGame && (
            <div
              style={{ position: "relative" }}
              onMouseMove={handleMouseMove}
              ref={sliderRef}
            >
              <SliderContainer>
                <SliderImage
                  src={screenshotsGame[currentImageIndex].image}
                  alt={`Скриншот ${currentImageIndex + 1}`}
                />
                <DotsContainer>
                  {screenshotsGame.map((_, index) => (
                    <Dot
                      key={uuid4()}
                      $isActive={index === currentImageIndex}
                    />
                  ))}
                </DotsContainer>
              </SliderContainer>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2vw" }}>
          <img
            src={game.background_image}
            alt={game.name}
            style={{ width: "15vw" }}
          />
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              WebkitLineClamp: "5",
              overflow: "hidden",
              width: "100%",
              maxHeight: "7.5em",
            }}
          >
            {game.description_raw}
          </div>
          <div>
            <p><strong>Оценка на Metacritic:</strong> {game.metacritic} {textMetacritic}</p>
            <p><strong>Рейтинг:</strong> {game.rating} из 5.00</p>
          </div>
          <div>
            <p>
              <strong>Дата релиза:</strong>
              {new Date(game.released).toLocaleDateString()}
            </p>
            <p>
              <strong>Среднее время игры:</strong> {game.playtime}
              {textHoursPlay}
            </p>
            <p>
              <strong style={{ display: "flex" }}>
                Платформы:
                <div style={{ display: "flex", gap: ".5vw" }}>
                  {game.parent_platforms.map((platform) => (
                    <span key={uuid4()}>
                      {createElement(
                        platformIcons[
                          platform.platform.name as keyof typeof platformIcons
                        ] || platformIcons.Global
                      )}
                    </span>
                  ))}
                </div>
              </strong>
            </p>
          </div>
        </div>
      </div>
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
