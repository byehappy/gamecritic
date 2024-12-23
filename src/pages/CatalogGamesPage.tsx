import { useState, useCallback, useEffect } from "react";
import {
  addPassedGame,
  getPassedGamesUser,
  getUserCount,
  getUserInfo,
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
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
const UserInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 25vh;
  padding: 2vh 5vw;
  gap: 5%;
`;
const IconUser = styled.img`
  height: calc(100px + 100 * (100vw / 1280));
  max-height: 200px;
  border-radius: 100%;
  background-color: #9494944e;
`;
const UserFormWrapper = styled.div`
  padding: 3%;
  gap: 5%;
  display: flex;
  flex-direction: column;
  width: 75%;
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
export const CatalogGamesPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<IGameDis[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [passedGameCount, setPassedGameCount] = useState<number | null>(null);
  const [user, setUser] = useState<{
    name: string | undefined;
    description: string | undefined;
    init_image: string | undefined;
  } | null>(null);
  const [filterFlags, setFilterFlags] = useState<FilterFlags>({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [bufferGames, setBufferGames] = useState<
    { id: string | number; action: "add" | "remove" }[]
  >([]);
  const addToBuffer = useCallback(
    (id: string | number, action: "add" | "remove") => {
      if (bufferGames.find((e) => e.id === id)) {
        const newBuffer = bufferGames.filter((e) => e.id !== id);
        setBufferGames([...newBuffer]);
      } else {
        setBufferGames((prev) => [...prev, { id, action }]);
      }
    },
    [bufferGames]
  );
  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFilterFlags((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };
  const getGames = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await getPassedGamesUser(id, filterFlags).then(
          (res) => res.data
        );
        setCount(res.count);
        setGames(res.arrayGames);
      } catch (error) {
        dispatch(setMessage({ error }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, filterFlags]
  );
  const getInfo = useCallback(
    async (userId: string) => {
      try {
        const resInfo = await getUserInfo(userId).then((res) => res.data);
        const { gameCount } = await getUserCount(userId);
        setPassedGameCount(gameCount);
        setUser({ ...resInfo });
      } catch (error) {
        dispatch(setMessage(error));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (userId) {
      if (userId === currentUser?.id) {
        navigate("/catalog-games");
        return;
      }
      getInfo(userId);
      getGames(userId);
    } else if (currentUser && !userId) {
      getGames(currentUser.id);
    }
  }, [currentUser, getGames, getInfo, navigate, userId]);
  const handlePassedGame = async (game: IGameDis) => {
    if (!currentUser) {
      dispatch(setMessage({ error: "Ошибка" }));
      return;
    }
    if (game.disabled) {
      try {
        setGames((prev) =>
          prev!.map((e) =>
            e.id === game.id ? { ...e, disabled: false } : { ...e }
          )
        );
        addToBuffer(game.id, "add");
      } catch (error) {
        dispatch(setMessage({ error }));
      }
    } else if (!game.disabled) {
      try {
        setGames((prev) =>
          prev!.map((e) =>
            e.id === game.id ? { ...e, disabled: true } : { ...e }
          )
        );
        addToBuffer(game.id, "remove");
      } catch (error) {
        dispatch(setMessage({ error }));
      }
    }
  };

  useEffect(() => {
    if (bufferGames.length === 0 || !currentUser) return;
    const timer = setTimeout(async () => {
      try {
        await Promise.all(
          bufferGames.map((item) =>
            item.action === "add"
              ? addPassedGame(item.id, currentUser.id)
              : UnpassedGame(item.id, currentUser.id)
          )
        );
        setBufferGames([]);
        const { gameCount } = await getUserCount(currentUser.id);
        setPassedGameCount(gameCount);
        dispatch(
          setMessage({ message: `Количество пройденных игр:${gameCount}` })
        );
      } catch (error) {
        dispatch(setMessage(error));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [bufferGames, currentUser, dispatch]);
  const blocker = useBlocker(bufferGames.length > 0);
  const handleSaveData = useCallback(async () => {
    if (bufferGames.length > 0 && currentUser) {
      await Promise.all(
        bufferGames.map((item) =>
          item.action === "add"
            ? addPassedGame(item.id, currentUser.id)
            : UnpassedGame(item.id, currentUser.id)
        )
      );
    }
  }, [bufferGames, currentUser]);
  useEffect(() => {
    if (blocker.state === "blocked") {
      handleSaveData();
      blocker.proceed();
    }
  }, [blocker, handleSaveData]);
  useEffect(() => {
    window.addEventListener("beforeunload", handleSaveData);
    return () => {
      window.removeEventListener("beforeunload", handleSaveData);
    };
  }, [handleSaveData]);

  return (
    <>
      {user && (
        <UserInfoWrapper>
          <IconUser style={{ objectFit: "cover" }} src={user.init_image} />
          <UserFormWrapper>
            <div>Никнейм: {user.name}</div>
            <div>Описание: {user.description}</div>
            <div>Кол-во игр: {passedGameCount}</div>
          </UserFormWrapper>
        </UserInfoWrapper>
      )}
      <div style={{ margin: "1vw",overflow:"hidden" }}>
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
            gridTemplateColumns:
              " repeat(auto-fit, minmax(calc(90px + 30 * (100vw / 1280)),1fr)",
            gap: "10px",
            alignContent:"center"
          }}
        >
          {loading && SkeletonFactory(filterFlags.page_size, "Card")}
          {!loading &&
            games?.map((game) => {
              return (
                <CardGameWrapper key={game.id}>
                  <CardGame
                    game={game}
                    id={game.id}
                    size="large"
                    cursorValue="default"
                    onCardClick={!userId ? handlePassedGame : undefined}
                  />
                </CardGameWrapper>
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
            margin: "1vw 0",
          }}
        />
      </div>
    </>
  );
};
