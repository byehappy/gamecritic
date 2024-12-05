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
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
const UserInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 25vh;
  padding: 2vh 5vw;
  gap: 5%;
`;
const IconUser = styled.img`
  width: 15%;
  height: 100%;
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
export const CatalogGamesPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<IGameDis[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [passedGameCount, setPassedGameCount] = useState<number | null>(null)
  const [user, setUser] = useState<{
    name: string | undefined;
    description: string | undefined;
    init_image: string | undefined;
  } | null>(null);
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
  const getGames = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await getPassedGamesUser(id,filterFlags).then((res) => res.data);
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
        const {gameCount} = await getUserCount(userId)
        setPassedGameCount(gameCount)
        setUser({...resInfo});
      } catch (error) {
        dispatch(setMessage(error));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (userId) {
      if(userId === currentUser?.id){
        navigate("/catalog-games")
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
        await addPassedGame(game.id, currentUser.id);
        setGames((prev) =>
          prev!.map((e) =>
            e.id === game.id ? { ...e, disabled: false } : { ...e }
          )
        );
        const {gameCount} = await getUserCount(currentUser.id)
        setPassedGameCount(gameCount)
        dispatch(setMessage({message:`Количество пройденных игр:${gameCount}`}));
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
    <>
      {user && (
        <UserInfoWrapper>
          <IconUser
            style={{ objectFit: "cover" }}
            src={user.init_image}
          />
          <UserFormWrapper>
            <div>Никнейм: {user.name}</div>
            <div>Описание: {user.description}</div>
            <div>Кол-во игр: {passedGameCount}</div>
          </UserFormWrapper>
        </UserInfoWrapper>
      )}
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
                  cursorValue="default"
                  onCardClick={!userId ? handlePassedGame : undefined}
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
            margin: "1vw 0",
          }}
        />
      </div>
    </>
  );
};
