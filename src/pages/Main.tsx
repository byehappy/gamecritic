import { useCallback, useEffect, useState } from "react";
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
import { InitTierData, LocalTierData, TierData } from "../interfaces/tierData";
import { arrayMove } from "@dnd-kit/sortable";
import { IGameDis } from "../interfaces/games";
import { CardGame } from "../components/Card/Card";
import { FilterFlags } from "../interfaces/filters";
import debounce from "debounce";
import { gameRequest } from "../axios/requests/games.requests";
import uuid4 from "uuid4";

const DefaultPage = 1;
const DefaultPageSize = 40;

function MainPage() {
  const [loading, setLoading] = useState({ rows: true, tray: true });
  const [totalCount, setTotalCount] = useState<number>(1);
  const [flagsParam, setFlagsParam] = useState<FilterFlags>({
    page: DefaultPage,
    page_size: DefaultPageSize,
  });
  const [tierData, setTierData] = useState<InitTierData>({
    rows: [
      { id: "0", tier: "Идеально", games: [], color: "#1677FF" },
      { id: "1", tier: "Супер", games: [], color: "#1677FF" },
      { id: "2", tier: "Отлично", games: [], color: "#1677FF" },
      { id: "3", tier: "Неинтересно", games: [], color: "#1677FF" },
      { id: "4", tier: "Ужасно", games: [], color: "#1677FF" },
    ],
    tray: {
      games: [],
    },
  });
  const [activeGame, setActiveGame] = useState<IGameDis | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    })
  );
  const loadGamesStorage = useCallback(async () => {
    const tiers = localStorage.getItem("tierData");
    if (tiers) {
      const parsedTiers: LocalTierData[] = JSON.parse(tiers);
      const tierGamesMap: Record<string, IGameDis[]> = {};

      await Promise.all(
        parsedTiers.map(async (row) => {
          const gamesData = await Promise.all(
            row.games.map((id) => gameRequest(id).then((res) => res.data))
          );
          tierGamesMap[row.id] = gamesData;
        })
      );
      setTierData((prev) => {
        const updateRows: TierData[] = parsedTiers.map((row) => {
          const games = tierGamesMap[row.id] || [];
          return { ...row, games };
        });
        return { ...prev, rows: updateRows };
      });
    }
    setLoading((prev) => ({ ...prev, rows: false }));
  }, []);

  useEffect(() => {
    loadGamesStorage();
  }, [loadGamesStorage]);

  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFlagsParam((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };

  const handleChageIndexRow = (index: number, direction: "up" | "down") => {
    const newTierData = [...tierData.rows];

    if (direction === "up" && index > 0) {
      [newTierData[index - 1], newTierData[index]] = [
        newTierData[index],
        newTierData[index - 1],
      ];
    } else if (direction === "down" && index < tierData.rows.length - 1) {
      [newTierData[index + 1], newTierData[index]] = [
        newTierData[index],
        newTierData[index + 1],
      ];
    }
    setTierData((prev) => {
      return {
        ...prev,
        rows: newTierData,
      };
    });
  };
  function enabledGamesInTray(
    tray: { games: IGameDis[] },
    findedTier?: TierData
  ): IGameDis[] {
    
    return tray.games.map((game) =>
      findedTier?.games.some(
        (tierGame) => game.id === `disable-${tierGame.id}`
      )
        ? {
            ...game,
            disabled: false,
            id: Number((game.id as string).replace("disable-", "")),
          }
        : game
    );
  }

  const handleManipulatorTier = (
    index: number,
    direction?: "up" | "down",
    deleteTier?: boolean
  ) => {
    setTierData((prev) => {
      const findedTier = prev.rows[index];
      const newId = uuid4();
      const newTier = {
        id: newId,
        tier: "Новое",
        games: [],
        color: "#1677FF",
      };
      const updateTiers = [...prev.rows];
      if (deleteTier) {
        updateTiers.splice(index, 1);
      } else {
        const insertIndex = direction === "up" ? index : index + 1;
        updateTiers.splice(insertIndex, 0, newTier);
      }
      return {
        ...prev,
        rows: updateTiers,
        tray: {
          games: deleteTier
            ? enabledGamesInTray(prev.tray, findedTier)
            : prev.tray.games,
        },
      };
    });
  };
  const updateTier = (
    id: string,
    tierName?: string,
    color: string = "primary",
    deleteGames: boolean = false
  ) => {
    setTierData((prev) => {
      const findedTier = prev.rows.find((tier) => id === tier.id);

      return {
        rows: prev.rows.map((tier) =>
          tier.id === id
            ? {
                ...tier,
                tier: tierName ?? tier.tier,
                color,
                games: deleteGames ? [] : tier.games,
              }
            : tier
        ),
        tray: {
          games: deleteGames
            ? enabledGamesInTray(prev.tray, findedTier)
            : prev.tray.games,
        },
      };
    });
  };

  const getGames = useCallback(async () => {
    setLoading((prev) => ({ ...prev, tray: true }));
    try {
      const response = await gamesRequest({
        ...flagsParam,
      });
      const localStorageGames = localStorage.getItem("tierData");
      const parsedLocalRows: LocalTierData[] = localStorageGames
        ? JSON.parse(localStorageGames)
        : [];
      const existingGamesInRows = parsedLocalRows.flatMap((row) => row.games);
      const newGames = response.data.results.map((game) => ({
        ...game,
        disabled: existingGamesInRows.some(
          (existingGame) => existingGame === game.id
        ),
        id: existingGamesInRows.some((existingGame) => existingGame === game.id)
          ? `disable-${game.id}`
          : game.id,
      }));

      setTierData((prev) => ({ ...prev, tray: { games: newGames } }));
      setTotalCount(response.data.count);
      setLoading((prev) => ({ ...prev, tray: false }));
    } catch (error) {
      setTierData((prev) => ({ ...prev, tray: { games: [] } }));
      console.log((error as Error).message);
    } finally {
      setLoading((prev) => ({ ...prev, tray: false }));
    }
  }, [flagsParam]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGames();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [getGames]);

  useEffect(() => {
    localStorage.setItem(
      "tierData",
      JSON.stringify(
        tierData.rows.map((row) => ({
          ...row,
          games: row.games.map((game) => game.id),
        }))
      )
    );
  }, [tierData.rows]);

  const findContainer = (id: string | number) => {
    if (id == "tray") {
      return "tray";
    }
    if (tierData.tray.games.map((e) => e.id).includes(id)) {
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
    return tierData.tray.games.find((game) => game.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    const draggedGame = findGame(active.id as number);

    if (!draggedGame) return;

    if (activeContainer && overContainer) {
      setTierData((prevData) => {
        const activeItems =
          activeContainer === "tray"
            ? prevData.tray.games
            : prevData.rows.find((row) => row.id === activeContainer)!.games;

        const overItems =
          overContainer === "tray"
            ? prevData.tray.games
            : prevData.rows.find((row) => row.id.toString() === overContainer)!
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
        let trayItems = prevData.tray.games;

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

        return {
          ...prevData,
          tray: { games: trayItems },
          rows: prevData.rows.map((row) => {
            if (row.id === activeContainer) {
              return { ...row, games: newActiveItems };
            }
            if (row.id === overContainer) {
              return { ...row, games: newOverItems };
            }

            return row;
          }),
        };
      });
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

    setTierData((prevData) => {
      const overItems =
        overContainer === "tray"
          ? prevData.tray.games
          : prevData.rows.find((row) => row.id.toString() === overContainer)!
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
      const gameInTray = prevData.tray.games.some(
        (item) => item.id === `disable-${draggedGame.id}`
      );
      if (activeContainer === "tray") {
        trayItems = prevData.tray.games.map((item) =>
          item.id === activeId
            ? { ...item, disabled: true, id: `disable-${item.id}` }
            : item
        );
      } else if (overContainer === "tray") {
        trayItems = gameInTray
          ? [
              ...prevData.tray.games.filter(
                (item) => item.id !== `disable-${draggedGame.id}`
              ),
              { ...draggedGame, disabled: false },
            ]
          : prevData.tray.games;
      } else {
        trayItems = prevData.tray.games;
      }
      return {
        ...prevData,
        tray: {
          games: trayItems,
        },
        rows: prevData.rows.map((row) => {
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
        }),
      };
    });
  };
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id;

    let activeGame = tierData.tray.games.find((item) => item.id === activeId);

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
      onDragOver={debounce(handleDragOver, 10)}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <TierTable
        loading={loading.rows}
        tierData={tierData.rows}
        changeIndex={handleChageIndexRow}
        handleManipulatorTier={handleManipulatorTier}
        updateTier={updateTier}
      />
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
          loading={loading.tray}
        />
        <Popover
          content={<Filter handleChangeFiters={handleChangeFiters} />}
          placement="bottom"
          trigger="click"
          title={"Фильтры"}
        >
          <Button size="large" type="primary" icon={<FilterOutlined />} />
        </Popover>
      </div>
      {!loading.tray && tierData.tray.games.length === 0 ? (
        <p style={{ textAlign: "center" }}>Ничего не найдено</p>
      ) : (
        <CardList
          games={tierData.tray.games}
          loading={loading.tray}
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
        {activeGame ? (
          <CardGame
            loading={loading.tray}
            id={activeGame.id}
            game={activeGame}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default MainPage;
