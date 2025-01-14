import { Button, Flex, Rate, Spin, Tooltip } from "antd";
import { Modal } from "../../modal/Modal";
import {
  LeftCircleOutlined,
  LoadingOutlined,
  RightCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  gameRequest,
  gameScreenshots,
} from "../../../axios/requests/games.requests";
import {
  createElement,
  createRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IGameOnly } from "../../../interfaces/games";
import uuid4 from "uuid4";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMessage } from "../../../redux/slice/messageSlice";
import {
  addFavoriteGame,
  checkFavoriteGame,
  delFavoriteGame,
} from "../../../axios";
import { platformIcons } from "@/public/assets/icons/platfroms";
import {
  SliderContainer,
  SliderImage,
  DotsContainer,
  Dot,
  PortalWrapper,
  MoadalWrapperGameInfo,
} from "./card.style";
import { useWordDeclination } from "../../../utils/hooks/useWorldDeclination";
import { createPortal } from "react-dom";
import { useTheme } from "styled-components";

export const CardModal: React.FC<{
  id: number;
  setOpenModalGameId: (
    value: React.SetStateAction<number | string | null | undefined>
  ) => void;
}> = ({ id, setOpenModalGameId }) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<IGameOnly | null>(null);
  const sliderRef = createRef<HTMLDivElement>();
  const [sliderWidth, setSliderWidth] = useState<number | undefined>(0);
  const [screenshotsGame, setScreenshotsGame] =
    useState<[{ image: string; id: number | string }]>();
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );
  const checkFavorite = useCallback(async () => {
    if (currentUser !== null && game !== null) {
      try {
        const res = await checkFavoriteGame(currentUser.id, game.id);
        switch (res.status) {
          case 200:
            setIsFavorite(true);
            break;
          case 204:
            setIsFavorite(false);
            break;
        }
      } catch (error) {
        dispatch(setMessage(error));
      }
    }
  }, [currentUser, dispatch, game]);
  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const responseGame = await gameRequest(id);
        const responseScreenshot = await gameScreenshots(id);
        if (responseScreenshot.results.length > 0) {
          setScreenshotsGame(
            responseScreenshot.results as [
              { image: string; id: number | string }
            ]
          );
        } else {
          setScreenshotsGame([
            {
              image: "",
              id: uuid4(),
            },
          ]);
        }

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
  }, [loading, sliderRef]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!screenshotsGame || !sliderWidth || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();

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
  const handleZoomInImage = () => {
    const zoomContainer = document.createElement("div");
    zoomContainer.id = "zoom-container";
    document.body.appendChild(zoomContainer);
    setPortalContainer(zoomContainer);
  };
  const gameInfo = game ? (
    <MoadalWrapperGameInfo>
      {screenshotsGame && (
        <div style={{ flex: 3 }}>
          <div
            onMouseMove={handleMouseMove}
            ref={sliderRef}
            style={{ height: "100%" }}
          >
            <SliderContainer onClick={handleZoomInImage}>
              {screenshotsGame.map((e, index) => (
                <SliderImage
                  key={e.id}
                  style={{
                    display: index === currentImageIndex ? "block" : "none",
                  }}
                  src={e.image}
                  alt={`Скриншот ${currentImageIndex + 1}`}
                />
              ))}
              <DotsContainer>
                {screenshotsGame.map((_, index) => (
                  <Dot
                    key={screenshotsGame[index].id}
                    $isActive={index === currentImageIndex}
                  />
                ))}
              </DotsContainer>
            </SliderContainer>
          </div>
          {portalContainer &&
            createPortal(
              <PortalWrapper
                onClick={(e) => {
                  e.stopPropagation();
                  document.body.removeChild(portalContainer);
                  setPortalContainer(null);
                }}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentImageIndex > 0)
                      setCurrentImageIndex((prev) => --prev);
                  }}
                  icon={
                    <LeftCircleOutlined
                      style={{ fontSize: theme.fontSizes.adaptivLogo }}
                    />
                  }
                  size="large"
                  style={{
                    width: "fit-content",
                    background: "none",
                    border: "none",
                    color: currentImageIndex === 0 ? "gray" : "white",
                  }}
                  disabled={currentImageIndex === 0}
                />
                <img
                  src={screenshotsGame[currentImageIndex].image}
                  alt={`Скриншот ${currentImageIndex + 1}`}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentImageIndex < screenshotsGame.length - 1)
                      setCurrentImageIndex((prev) => ++prev);
                  }}
                  icon={
                    <RightCircleOutlined
                      style={{ fontSize: theme.fontSizes.adaptivLogo }}
                    />
                  }
                  size="large"
                  style={{
                    width: "fit-content",
                    background: "none",
                    border: "none",
                    color:
                      currentImageIndex === screenshotsGame.length - 1
                        ? "gray"
                        : "white",
                  }}
                  disabled={currentImageIndex === screenshotsGame.length - 1}
                />
              </PortalWrapper>,
              portalContainer
            )}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div>
          {window.innerWidth >= 1440 && (
            <img
              src={
                game.background_image
              }
              alt={game.name}
              style={{
                width: "100%",
                maxHeight: "100px",
                objectFit: "cover",
                minHeight: "15vh",
              }}
            />
          )}
          <div
            style={{
              overflow: "auto",
              width: "100%",
              maxHeight: "8em",
              fontSize: theme.fontSizes.adaptivSmallText,
              marginBottom: "20px",
            }}
          >
            {game.description_raw}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1vh",
            justifyContent: "space-around",
            height: "100%",
            fontSize: theme.fontSizes.adaptivSmallText,
          }}
        >
          {(game.metacritic !== null || game.metacritic === 0) && (
            <div>
              <strong>Оценка на Metacritic:</strong> {game.metacritic}{" "}
              {textMetacritic}
            </div>
          )}
          {game.rating !== 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <strong style={{ marginRight: ".4vw" }}>Рейтинг:</strong>{" "}
              <Tooltip title={`${game.rating} из 5`}>
                <div>
                  <Rate allowHalf defaultValue={Number(game.rating)} disabled />
                </div>
              </Tooltip>
            </div>
          )}
          {game.released !== null ? (
            <div>
              <strong>Дата релиза:</strong>{" "}
              {new Date(game.released).toLocaleDateString()}
            </div>
          ) : (
            <div>
              <strong>Дата релиза:</strong> В ближайшее время
            </div>
          )}
          <div>
            <strong>Среднее время игры:</strong> {game.playtime} {textHoursPlay}
          </div>
          <div>
            <strong style={{ display: "flex" }}>
              Платформы:
              <div style={{ display: "flex", gap: "10px", marginLeft: ".4vw" }}>
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
          </div>
        </div>
      </div>
    </MoadalWrapperGameInfo>
  ) : (
    <div>Не удалось загрузить данные об игре.</div>
  );

  const modalHeader = loading ? undefined : (
    <h2 style={{ textWrap: "nowrap", fontSize: theme.fontSizes.adaptivText }}>
      {game?.name}{" "}
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
    </h2>
  );

  return (
    <Modal
      key={uuid4()}
      isOpen={true}
      onClose={() => setOpenModalGameId(null)}
      header={modalHeader}
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
