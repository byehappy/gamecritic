import { useState, useCallback, useEffect } from "react";
import {
  addPassedGame,
  gamesRequest,
  getPassedGame,
  UnpassedGame,
} from "../axios";
import { FilterFlags } from "../interfaces/filters";
import { IGameDis } from "../interfaces/games";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setMessage } from "../redux/slice/messageSlice";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constans";
import { Pagination } from "antd";
import Search from "antd/es/input/Search";
import { CardGame } from "../components/card/CardGame";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";

export const CatalogGamesPage = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<IGameDis[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [filterFlags, setFilterFlags] = useState<FilterFlags>({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFilterFlags((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };
  const getGames = useCallback(async () => {
    if (!currentUser) {
      return;
    }
    setLoading(true);
    try {
      const res = await gamesRequest(filterFlags).then((res) => res.data);
      setCount(res.count);
      const games = res.results.map(
        async (e) =>
          await getPassedGame(e.id, currentUser?.id).then((passed) => ({
            ...e,
            disabled: !passed,
          }))
      );
      const checkGames = await Promise.all(games);

      setGames(checkGames);
    } catch (error) {
      dispatch(setMessage({ error }));
    } finally {
      setLoading(false);
    }
  }, [currentUser, dispatch, filterFlags]);
  useEffect(() => {
    getGames();
  }, [getGames]);
  const handlePassedGame = async (game: IGameDis) => {
    if (!currentUser) {
      dispatch(setMessage({ error: "Ошибка" }));
      return;
    }
    if (game.disabled) {
      try {
        const result = await addPassedGame(game.id, currentUser.id);
        setGames((prev) =>
          prev!.map((e) =>
            e.id === game.id ? { ...e, disabled: false } : { ...e }
          )
        );
        dispatch(setMessage(result.data));
      } catch (error) {
        dispatch(setMessage({ error }));
      }
    } else if (!game.disabled) {
      try {
        const result = await UnpassedGame(game.id, currentUser.id);
        setGames((prev) =>
          prev!.map((e) =>
            e.id === game.id ? { ...e, disabled: true } : { ...e }
          )
        );
        dispatch(setMessage(result.data));
      } catch (error) {
        dispatch(setMessage({ error }));
      }
    }
  };
  return (
    <div style={{ display: "grid", margin: "1vw" }}>
      <Search
        style={{ marginBottom: "1vw" }}
        placeholder="Введите название игры"
        onSearch={(value) => {
          handleChangeFiters("page", 1);
          handleChangeFiters("search", value);
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: " repeat(auto-fit, minmax(130px,1fr)",
          gap: "1rem",
        }}
      >
        {loading && SkeletonFactory(filterFlags.page_size, "Card")}
        {!loading &&
          games?.map((game) => {
            return (
              <CardGame
                key={game.id}
                game={game}
                id={game.id}
                size="large"
                onCardClick={handlePassedGame}
              />
            );
          })}
      </div>
      <Pagination
        defaultCurrent={1}
        defaultPageSize={40}
        total={count ?? 1}
        pageSizeOptions={[10, 20, 30, 40]}
        onChange={(page, pageSize) => {
          handleChangeFiters("page", page);
          handleChangeFiters("page_size", pageSize);
        }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      />
    </div>
  );
};
