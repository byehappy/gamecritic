import { useCallback, useEffect, useRef, useState } from "react";
import {
  DeleteTier,
  gamesRequest,
  getTierById,
  getUserRows,
  updateUserRows,
} from "../axios";
import { Button, FloatButton, Pagination, Popover, Spin } from "antd";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";
import {
  DeleteOutlined,
  FilterOutlined,
  LoadingOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Filter } from "../components/filter/Filter";
import { TierTable } from "../components/tierTable/TierTable";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SaveTierData } from "../interfaces/tierData";
import { arrayMove } from "@dnd-kit/sortable";
import { IGame, IGameDis } from "../interfaces/games";
import { CardGame } from "../components/card/CardGame";
import { FilterFlags, FilterTierValue } from "../interfaces/filters";
import { gameRequest } from "../axios/requests/games.requests";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setDefault,
  setFilters,
  setRows,
  setTrayGames,
} from "../redux/slice/tierDataSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useBeforeUnloadSave } from "../utils/hooks/beforeUnload";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constans";
import { setMessage } from "../redux/slice/messageSlice";
import { logout } from "../redux/slice/authSlice";
import html2canvas from "html2canvas";
import { AxiosError } from "axios";

function TierPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [saving,setSaving] = useState(false);
  const { rows } = useAppSelector((state) => state.tierData);
  const rowsRef = useRef("");
  const [dirty, setDirty] = useState(false);
  const { tierType, paramsUserId } = useParams() as {
    tierType: string;
    paramsUserId?: string;
  };
  const tierData = useAppSelector((state) => state.tierData);
  const dispatch = useAppDispatch();
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadingTray, setLoadingTray] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [tier, setTier] = useState<{
    name: string;
    id: string;
    filter: FilterTierValue;
    pickGame: IGame[] | [];
    count: number | null;
    authorId: string;
    rows: {
      id: string;
      name: string;
      color: string;
    }[];
  }>();
  const [filterFlags, setFilterFlags] = useState<FilterFlags>({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [activeGame, setActiveGame] = useState<IGameDis | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    })
  );
  const navigate = useNavigate();
  useBeforeUnloadSave(
    tierData.rows.map((row) => ({
      ...row,
      games: row.games.map((game) => game.id),
    })),
    tierType,
    dirty && !paramsUserId
  );
  const setTierFliter = useCallback(async () => {
    const res = await getTierById(tierType);
    const axiosTier = res.data;
    const tierInfo = {
      name: axiosTier.title,
      id: axiosTier.id,
      filter: {
        ...axiosTier.filters,
      },
      pickGame: axiosTier.pickGame,
      count: axiosTier.count,
      rows: axiosTier.rows,
      authorId: axiosTier.author_id,
    };
    setTier(tierInfo);
    setFilterFlags((prev) => ({
      ...prev,
      dates: tierInfo.filter.dates.value,
      genres: tierInfo.filter.genres.value,
      platforms: tierInfo.filter.platforms.value,
      tags: tierInfo.filter.tags.value,
    }));
    dispatch(setFilters(axiosTier.filters));
  }, [dispatch, tierType]);
  useEffect(() => {
    setTierFliter();
  }, [setTierFliter]);
  useEffect(() => {
    if (!loadingRows) {
      setDirty(
        JSON.stringify(
          tierData.rows.map((row) => ({
            ...row,
            games: row.games.map((game) => game.id),
          }))
        ) !== rowsRef.current
      );
    }
  }, [loadingRows, rows, tierData.rows]);
  useEffect(() => {
    if (dirty && paramsUserId && !loadingRows) {
      navigate(`/tier-list/${tierType}`);
    }
  }, [dirty, loadingRows, navigate, paramsUserId, tierType]);
  const loadGamesStorage = useCallback(async () => {
    let tiers;
    if (paramsUserId) {
      tiers = await getUserRows(paramsUserId, tierType).then(
        (res) => res.data.rows
      );
    } else if (currentUser) {
      tiers = await getUserRows(currentUser.id, tierType).then(
        (res) => res.data.rows
      );
    } else {
      tiers = sessionStorage.getItem(tierType);
    }
    if (!tiers) {
      if (!tier) {
        return;
      }

      dispatch(setDefault(tier.rows));
      setLoadingRows(false);
      return;
    }
    rowsRef.current = tiers;
    const parsedTiers: SaveTierData[] = JSON.parse(tiers);
    const gameIds = parsedTiers.flatMap((tier) => tier.games);
    const gameRequests = gameIds.map((id) =>
      gameRequest(id).then((res) => res.data)
    );
    const gamesData = await Promise.all(gameRequests);
    const gamesMap: Record<string, IGame> = gamesData.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {} as Record<string, IGame>);
    const updatedRows = parsedTiers.map((row) => {
      const games = row.games.map((gameId) => gamesMap[gameId] || {});
      return { ...row, games };
    });
    dispatch(setRows(updatedRows));
    setLoadingRows(false);
  }, [currentUser, dispatch, paramsUserId, tier, tierType]);
  useEffect(() => {
    loadGamesStorage();
  }, [loadGamesStorage]);
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
    if (loadingRows) return;
    setLoadingTray(true);
    try {
      const existingGamesInRows = rows.flatMap((row) => row.games);
      let resGames: IGame[], count: number;
      if (tier?.pickGame) {
        resGames = tier.pickGame;
        count = tier.count!;
      } else {
        const response = await gamesRequest({
          ...filterFlags,
        });
        resGames = response.data.results;
        count = response.data.count;
      }
      const newGames: IGameDis[] = resGames.map((game) => ({
        ...game,
        disabled: existingGamesInRows.some(
          (existingGame) => existingGame.id === game.id
        ),
        id: existingGamesInRows.some(
          (existingGame) => existingGame.id === game.id
        )
          ? `disable-${game.id}`
          : game.id,
      }));
      dispatch(setTrayGames(newGames));
      setTotalCount(count);
      setLoadingTray(false);
    } catch {
      dispatch(setTrayGames([]));
    } finally {
      setLoadingTray(false);
    }
  }, [dispatch, filterFlags, loadingRows]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGames();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [getGames]);
  const findContainer = (id: string | number) => {
    if (id == "tray") {
      return "tray";
    }
    if (tierData.games.map((e) => e.id).includes(id)) {
      return "tray";
    }
    for (const row of tierData.rows) {
      if (row.games.map((e) => e.id).includes(id as number)) {
        return row.id;
      }
    }
    return id;
  };
  const findGame = (id: number): IGameDis | IGame | undefined => {
    for (const tier of tierData.rows) {
      const foundGame = tier.games.find((game) => game.id === id);
      if (foundGame) {
        return foundGame;
      }
    }
    return tierData.games.find((game) => game.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    const draggedGame = findGame(active.id as number);

    if (!draggedGame) return;

    if (activeContainer && overContainer) {
      const activeItems =
        activeContainer === "tray"
          ? tierData.games
          : tierData.rows.find((row) => row.id === activeContainer)!.games;

      const overItems =
        overContainer === "tray"
          ? tierData.games
          : tierData.rows.find((row) => row.id.toString() === overContainer)!
              .games;
      const activeIndex = activeItems.map((e) => e.id).indexOf(active.id);
      const overIndex = overItems.map((e) => e.id).indexOf(over.id as number);

      let newActiveItems = [...activeItems];
      const newOverItems = [...overItems];

      if (activeContainer === overContainer) {
        newActiveItems = arrayMove(activeItems, activeIndex, overIndex);
      } else {
        newActiveItems.splice(activeIndex, 1);
        if (overIndex === -1) {
          newOverItems.push(draggedGame);
        } else {
          newOverItems.splice(overIndex, 0, draggedGame);
        }
      }
      let trayItems = tierData.games;

      if (activeContainer == "tray") {
        if (overContainer === "tray") {
          trayItems = newActiveItems;
        } else {
          trayItems = activeItems.map((game) =>
            game.id === draggedGame.id
              ? { ...game, disabled: true, id: `disable-${game.id}` }
              : game
          );
        }
      } else if (overContainer == "tray") {
        trayItems = overItems.map((game) => {
          if (game.id === `disable-${draggedGame.id}`) {
            return { ...game, disabled: false };
          } else {
            return game;
          }
        });
      }
      dispatch(setTrayGames(trayItems));
      dispatch(
        setRows(
          tierData.rows.map((row) => {
            if (row.id === activeContainer) {
              return { ...row, games: newActiveItems as IGame[] };
            }
            if (row.id === overContainer) {
              return { ...row, games: newOverItems as IGame[] };
            }

            return row;
          })
        )
      );
    }
    setActiveGame(null);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    const draggedGame = findGame(activeId as number);
    if (!draggedGame) return;

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    const overItems =
      overContainer === "tray"
        ? tierData.games
        : tierData.rows.find((row) => row.id.toString() === overContainer)!
            .games;

    let newIndex;
    if (activeContainer === overContainer) {
      newIndex = overItems.length;
    } else {
      const overIndex = overItems.findIndex((game) => game.id === overId);
      const isBelowLastItem = overIndex === overItems.length - 1 ? 1 : 0;

      newIndex =
        overIndex >= 0 ? overIndex + isBelowLastItem : overItems.length;
    }

    let trayItems;
    const gameInTray = tierData.games.some(
      (item) => item.id === `disable-${draggedGame.id}`
    );
    if (activeContainer === "tray") {
      trayItems = tierData.games.map((item) =>
        item.id === activeId
          ? { ...item, disabled: true, id: `disable-${item.id}` }
          : item
      );
    } else if (overContainer === "tray") {
      trayItems = gameInTray
        ? [
            ...tierData.games.filter(
              (item) => item.id !== `disable-${draggedGame.id}`
            ),
            { ...draggedGame, disabled: false },
          ]
        : tierData.games;
    } else {
      trayItems = tierData.games;
    }
    dispatch(setTrayGames(trayItems));
    dispatch(
      setRows(
        tierData.rows.map((row) => {
          if (row.id === activeContainer) {
            return {
              ...row,
              games: row.games.filter((item) => item.id !== activeId),
            };
          }
          if (row.id === overContainer) {
            return {
              ...row,
              games: [
                ...row.games.slice(0, newIndex),
                draggedGame as IGame,
                ...row.games.slice(newIndex),
              ],
            };
          }
          return row;
        })
      )
    );
  };
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id;

    let activeGame = tierData.games.find((item) => item.id === activeId);

    if (!activeGame) {
      for (const row of tierData.rows) {
        activeGame = row.games.find((game) => game.id === activeId);
        if (activeGame) break;
      }
    }
    if (activeGame) {
      setActiveGame(activeGame);
    }
  };
  const handleSaveRows = async () => {
    sessionStorage.removeItem(tierType);
    const rowsGamesIds = tierData.rows.map((row) => ({
      ...row,
      games: row.games.map((game) => game.id),
    }));
    if (!dirty) {
      dispatch(
        setMessage({
          message: "Изменений не обнаружено",
        })
      );
      return;
    }
    if (currentUser) {
      setSaving(true)
      const canvas = await html2canvas(document.getElementById("table")!, {
        useCORS: false,
        proxy: "http://localhost:3001/proxy",
      });
      const image = canvas.toDataURL("img/png");
      try {
        const res = await updateUserRows(
          currentUser.id,
          tierType,
          JSON.stringify(rowsGamesIds),
          image
        );
        dispatch(
          setMessage({
            success: "Успешно сохранено",
          })
        );
        rowsRef.current = res.data.rows
        setDirty(false);
      } catch (e) {
        const error = e as AxiosError;
        if (
          typeof error.response?.data === "object" &&
          error.response.data &&
          "error" in error.response.data
        ) {
          dispatch(
            setMessage({
              error: error.response?.data.error,
            })
          );
        }
        if (error.response?.status !== 429) {
          sessionStorage.setItem(tierType, JSON.stringify(rowsGamesIds));
        }
        if (!localStorage.getItem("refreshToken")) {
          dispatch(logout());
        }
      } finally {
        setSaving(false)
      }
    } else {
      dispatch(
        setMessage({
          message: "Чтобы сохранять результат необходимо авторизоваться",
        })
      );
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <h1
        style={{
          margin: "1vw 0",
          width: "100%",
          textAlign: "center",
          color: "#2e2532",
        }}
      >
        {tier?.name}{" "}
        {currentUser && tier && currentUser.id === tier.authorId && (
          <Button
            onClick={() => {
              try {
                DeleteTier(tier.id, currentUser.id);
                dispatch(setMessage({ success: "Успешно удалено" }));
                navigate("/");
              } catch (error) {
                dispatch(setMessage(error));
              }
            }}
            style={{ background: "red" }}
          >
            <DeleteOutlined style={{ color: "white", fontSize: "1rem" }} />
          </Button>
        )}
      </h1>
      <div id="table">
        <TierTable loading={loadingRows || loadingTray} />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1vh",
          marginTop: "3vh",
          marginBottom: "1vh",
        }}
      >
        <Search
          placeholder="Введите название игры"
          enterButton="Поиск"
          onChange={(e) => {
            handleChangeFiters("page", 1);
            handleChangeFiters("search", e.target.value);
          }}
          size="large"
          onSearch={(value) => {
            handleChangeFiters("page", 1);
            handleChangeFiters("search", value);
          }}
          loading={loadingTray}
        />
        <Popover
          content={
            <Filter
              handleChangeFiters={handleChangeFiters}
              filters={tier?.filter}
            />
          }
          overlayInnerStyle={{width:"25vw"}}
          placement="bottom"
          trigger="click"
          title={"Фильтры"}
        >
          <Button size="large" type="primary" icon={<FilterOutlined />} />
        </Popover>
      </div>
      {!loadingTray && tierData.games.length === 0 ? (
        <p style={{ textAlign: "center" }}>Ничего не найдено</p>
      ) : (
        <CardList loading={loadingTray} pageSize={filterFlags.page_size} />
      )}
      <div style={{ margin: "4vh 0" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            defaultCurrent={1}
            defaultPageSize={40}
            total={totalCount}
            onChange={(page, pageSize) => {
              handleChangeFiters("page", page);
              handleChangeFiters("page_size", pageSize);
            }}
            pageSizeOptions={[10, 20, 30, 40]}
          />
        </div>
      </div>
      <DragOverlay>
        {activeGame ? <CardGame id={activeGame.id} game={activeGame} /> : null}
      </DragOverlay>
      <FloatButton
        style={{ zIndex: 5 }}
        icon={!saving ? <SaveOutlined /> : <Spin indicator={<LoadingOutlined spin />} size="small" />}
        tooltip={<div>Сохранить</div>}
        onClick={!saving ? handleSaveRows : undefined}
      />
    </DndContext>
  );
}

export default TierPage;
