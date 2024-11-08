import { useCallback, useEffect, useRef, useState } from "react";
import { gamesRequest } from "../axios";
import { Button, Pagination, Popover } from "antd";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";
import { FilterOutlined } from "@ant-design/icons";
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
import { LocalTierData } from "../interfaces/tierData";
import { arrayMove } from "@dnd-kit/sortable";
import { IGameDis } from "../interfaces/games";
import { CardGame } from "../components/card/Card";
import { FilterFlags } from "../interfaces/filters";
import { gameRequest } from "../axios/requests/games.requests";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setDefault, setRows, setTrayGames } from "../redux/slice/tierDataSlice";
import { useParams } from "react-router-dom";
import getFiltersTierType from "../utils/getFilterOnName";
const DefaultPage = 1;
const DefaultPageSize = 40;

function TierPage() {
  const params = useParams();
  const filterFlags = getFiltersTierType(params.tierType as string);
  const tierData = useAppSelector((state) => state.tierData);
  const dispatch = useAppDispatch();
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadingTray, setLoadingTray] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [flagsParam, setFlagsParam] = useState<FilterFlags>({
    page: DefaultPage,
    page_size: DefaultPageSize,
    ...filterFlags?.filters
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
  const loadGamesStorage = useCallback(async () => {
    const tiers = localStorage.getItem(params.tierType!.toString());
    if (!tiers) {
      dispatch(setDefault())
      setLoadingRows(false);
      return;
    }
    const parsedTiers: LocalTierData[] = JSON.parse(tiers);
    const gameIds = parsedTiers.flatMap((tier) => tier.games);
    const gameRequests = gameIds.map((id) =>
      gameRequest(id).then((res) => res.data)
    );
    const gamesData = await Promise.all(gameRequests);
    const gamesMap: Record<string, IGameDis> = gamesData.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {} as Record<string, IGameDis>);
    const updatedRows = parsedTiers.map((row) => {
      const games = row.games.map((gameId) => gamesMap[gameId] || {});
      return { ...row, games };
    });
    dispatch(setRows(updatedRows));
    setLoadingRows(false);
  }, [dispatch,params.tierType]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    if(params.tierType){
      loadGamesStorage();
    }
  }, [loadGamesStorage, params]);

  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFlagsParam((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };

  const getGames = useCallback(async () => {
    setLoadingTray(true);
    try {
      const response = await gamesRequest({
        ...flagsParam,
      });
      const localStorageGames = localStorage.getItem(params.tierType as string);
      const parsedLocalRows: LocalTierData[] = localStorageGames
        ? JSON.parse(localStorageGames)
        : [];
      const existingGamesInRows = parsedLocalRows.flatMap((row) => row.games);
      const newGames: IGameDis[] = response.data.results.map((game) => ({
        ...game,
        disabled: existingGamesInRows.some(
          (existingGame) => existingGame === game.id
        ),
        id: existingGamesInRows.some((existingGame) => existingGame === game.id)
          ? `disable-${game.id}`
          : game.id,
      }));
      dispatch(setTrayGames(newGames));
      setTotalCount(response.data.count);
      setLoadingTray(false);
    } catch (error) {
      dispatch(setTrayGames([]));
      console.log((error as Error).message);
    } finally {
      setLoadingTray(false);
    }
  }, [dispatch, flagsParam, params.tierType]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGames();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [getGames]);

  useEffect(() => {
    if (!loadingRows && params.tierType) {
      localStorage.setItem(
        params.tierType.toString(),
        JSON.stringify(
          tierData.rows.map((row) => ({
            ...row,
            games: row.games.map((game) => game.id),
          }))
        )
      );
    }
  }, [tierData.rows]);

  const findContainer = (id: string | number) => {
    if (id == "tray") {
      return "tray";
    }
    if (tierData.games.map((e) => e.id).includes(id)) {
      return "tray";
    }
    for (const row of tierData.rows) {
      if (row.games.map((e) => e.id).includes(id)) {
        return row.id;
      }
    }
    return id;
  };
  const findGame = (id: number): IGameDis | undefined => {
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
      const activeIndex = activeItems
        .map((e) => e.id)
        .indexOf(active.id as number);
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
              return { ...row, games: newActiveItems };
            }
            if (row.id === overContainer) {
              return { ...row, games: newOverItems };
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
                draggedGame,
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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <h1 style={{margin:"1vw 0",width:"100%",textAlign:"center"}}>{filterFlags?.name}</h1>
      <TierTable loading={loadingRows} />
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
              filterFlags={filterFlags}
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
        <CardList
          loading={loadingTray}
          pageSize={flagsParam.page_size}
        />
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
    </DndContext>
  );
}

export default TierPage;
