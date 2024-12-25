import { Pagination, Popover } from "antd";
import Search from "antd/es/input/Search";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { IAboutGame } from "../../interfaces/aboutGames";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setMessage } from "../../redux/slice/messageSlice";
import { gameRequest, gamesRequest, updateAboutGame } from "../../axios";
import { IGame } from "../../interfaces/games";
import { FilterFlags } from "../../interfaces/filters";
import { DEFAULT_PAGE } from "../../utils/constans";
import { CardGame } from "../card/CardGame";
const AbouteCardWrapper = styled.div`
  width: calc(240px + 40 * (100vw / 1280));
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 100%;
    height: 31vh;
  }
  div {
    position: relative;
    img {
      width: 100%;
    }
  }
  .bottom-text {
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
    line-height: 20px;
    background-color: #000000ce;
    gap: 0.2vw;
    display: flex;
    height: fit-content;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 45%;
    text-align: center;
    font-size: 1.2em;
  }
`;
const GameCardWrapper = styled.div`
  min-width: 130px;
  div {
    touch-action: auto;
  }
`;
export const AboutCard: React.FC<{ card: IAboutGame; change: boolean }> = ({
  card,
  change,
}) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueGame, setValueGame] = useState<IGame | null>(null);
  const [choiceGames, setChoiceGames] = useState<IGame[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [filterFlags, setFilterFlags] = useState<FilterFlags>({
    page: DEFAULT_PAGE,
    page_size: 5,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const getGame = useCallback(
    async (id?: number) => {
      try {
        const res = await gameRequest(id ?? card.value).then((res) => res.data);
        setValueGame(res);
      } catch (error) {
        dispatch(setMessage({ error }));
      }
    },
    [dispatch, card.value]
  );
  const getGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gamesRequest(filterFlags).then((res) => res.data);
      setCount(res.count);
      setChoiceGames(res.results);
    } catch (error) {
      dispatch(setMessage({ error }));
    } finally {
      setLoading(false);
    }
  }, [dispatch, filterFlags]);
  useEffect(() => {
    if (card.value) {
      getGame();
    }
  }, [card.value, getGame]);
  useEffect(() => {
    if (open) {
      getGames();
    }
  }, [getGames, open]);
  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFilterFlags((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };
  const choiceGame = async (id: number) => {
    if (!currentUser) return;
    try {
      await updateAboutGame(currentUser.id, card.id, id);
      getGame(id);
    } catch (error) {
      dispatch(setMessage(error));
    }
  };
  return (
    <AbouteCardWrapper>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {change ? (
          <Popover
            arrow={false}
            open={open}
            onOpenChange={handleOpenChange}
            content={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "32vh",
                  gap: "5%",
                }}
              >
                <Search
                  placeholder="Введите название игры"
                  onSearch={(value) => {
                    handleChangeFiters("page", 1);
                    handleChangeFiters("search", value);
                  }}
                />
                <div
                  ref={scrollRef}
                  style={{
                    display: "inline-flex",
                    overflowX: "auto",
                    gap: "1%",
                  }}
                >
                  {loading &&
                    SkeletonFactory(filterFlags.page_size, "Card-small")}
                  {!loading &&
                    choiceGames?.map((game) => {
                      return (
                        <GameCardWrapper key={game.id}>
                          <CardGame
                            game={{
                              ...game,
                              disabled: game.id === valueGame?.id,
                            }}
                            id={game.id}
                            size="small"
                            onCardClick={() => {
                              choiceGame(game.id);
                            }}
                          />
                        </GameCardWrapper>
                      );
                    })}
                </div>
                <Pagination
                  defaultCurrent={1}
                  defaultPageSize={5}
                  total={count ?? 1}
                  pageSizeOptions={[5]}
                  size={window.innerWidth <= 425 ? "small" : "default"}
                  onChange={(page, pageSize) => {
                    handleChangeFiters("page", page);
                    handleChangeFiters("page_size", pageSize);
                    scrollRef.current?.scroll(0, 0);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </div>
            }
            placement="bottom"
            trigger="click"
            title={"Выбрать игру"}
          >
            <img
              src={valueGame?.background_image}
              alt={valueGame?.name ?? card.name}
              style={{
                objectFit: "cover",
                cursor: "pointer",
                width: "100%",
                opacity:
                  !valueGame?.name && valueGame?.background_image ? 0.25 : 1,
                border: "1px solid black",
                minHeight: "267px",
              }}
            />
          </Popover>
        ) : (
          <img
            src={valueGame?.background_image}
            alt={valueGame?.name ?? card.name}
            style={{
              objectFit: "cover",
              border: "1px solid black",
              minWidth: "100%",
              minHeight: "267px",
            }}
          />
        )}
        <div className="bottom-text">
          {card.name}
          <span>{valueGame?.name ?? "Не выбрано"}</span>
        </div>
      </div>
    </AbouteCardWrapper>
  );
};
