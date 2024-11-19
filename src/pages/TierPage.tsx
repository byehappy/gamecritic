import { useCallback, useEffect, useRef, useState } from "react";
import {
  gamesRequest,
  getTierById,
  getUserRows,
  updateUserRows,
} from "../axios";
import { Button, FloatButton, Pagination, Popover } from "antd";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";
import { FilterOutlined, SaveOutlined } from "@ant-design/icons";
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
import { CardGame } from "../components/card/Card";
import { FilterFlags } from "../interfaces/filters";
import { gameRequest } from "../axios/requests/games.requests";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setDefault,
  setRows,
  setTrayGames,
} from "../redux/slice/tierDataSlice";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { useBeforeUnloadSave } from "../utils/beforeUnload";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constans";
import { setMessage } from "../redux/slice/messageSlice";
import { logout } from "../redux/slice/authSlice";
import html2canvas from "html2canvas";

function TierPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { rows } = useAppSelector((state) => state.tierData);
  const rowsRef = useRef(rows);
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
    filter: { genres?: string; platforms?: string; tags?: string };
  }>();
  const [filterFlags, setFilterFlags] = useState<FilterFlags>({
    page: DEFAULT_PAGE,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [activeGame, setActiveGame] = useState<IGameDis | null>(null);
  const dataFetchedRef = useRef(false);
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
      filter: {
        genres: axiosTier.genres,
        platforms: axiosTier.platforms,
        tags: axiosTier.tags,
      },
    };
    setTier(tierInfo);
    setFilterFlags((prev) => ({
      ...prev,
      ...tierInfo.filter,
    }));
  }, [tierType]);
  useEffect(() => {
    setTierFliter();
  }, [setTierFliter]);
  useEffect(() => {
    if (!dirty) {
      setDirty(JSON.stringify(rows) !== JSON.stringify(rowsRef.current));
    }
  }, [dirty, rows]);
  useEffect(() => {
    if (dirty && paramsUserId) {
      navigate(`/tier-list/${tierType}`);
    }
  }, [dirty, loadingTray, navigate, paramsUserId, tierType]);
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
      dispatch(setDefault());
      setLoadingRows(false);
      return;
    }
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
  }, [currentUser, dispatch, tierType]);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if (tierType) {
      loadGamesStorage();
    }
  }, [loadGamesStorage, tierType]);
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
      const response = await gamesRequest({
        ...filterFlags,
      });
      const existingGamesInRows = rows.flatMap((row) => row.games);
      const newGames: IGameDis[] = response.data.results.map((game) => ({
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
      setTotalCount(response.data.count);
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
  //TODO:если сгорел токен заново запустить рефреш если не удачно то выкинуть ошибку
  const handleSaveRows = async () => {
    sessionStorage.removeItem(tierType);
    const rowsGamesIds = tierData.rows.map((row) => ({
      ...row,
      games: row.games.map((game) => game.id),
    }));
    if (currentUser) {
      const canvas = await html2canvas(document.getElementById("table")!, {
        useCORS: false,
        proxy: "http://localhost:3001/proxy",
      });
      const image = canvas.toDataURL("img/png");
      try {
        await updateUserRows(
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
      } catch {
        sessionStorage.setItem(
          `save-${tierType}`,
          JSON.stringify(rowsGamesIds)
        );
        dispatch(
          setMessage({
            error: "Сохранение не удалось. Попробуйте авторизоваться",
          })
        );
        dispatch(logout());
      }
    } else {
      dispatch(
        setMessage({
          message: "Результат сохраниться после авторизации",
        })
      );
      sessionStorage.setItem(`save-${tierType}`, JSON.stringify(rowsGamesIds));
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <h1 style={{ margin: "1vw 0", width: "100%", textAlign: "center" }}>
        {tier?.name}
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
        style={{ zIndex: 1000 }}
        icon={<SaveOutlined />}
        tooltip={<div>Сохранить</div>}
        onClick={handleSaveRows}
      />
      ;
    </DndContext>
  );
}

export default TierPage;
