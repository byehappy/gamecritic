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
} from "@dnd-kit/core";
import { InitTierData } from "../interfaces/tierData";
import { arrayMove } from "@dnd-kit/sortable";
import { IGameDis } from "../interfaces/games";
import { CardGame } from "../components/Card/Card";
import { FilterFlags } from "../interfaces/filters";

const DefaultPage = 1;
const DefaultPageSize = 40;

function MainPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [flagsParam, setFlagsParam] = useState<FilterFlags>({
    page: DefaultPage,
    page_size: DefaultPageSize,
  });
  const [tierData, setTierData] = useState<InitTierData>({
    rows: [
      { key: "0", id: "0", tier: "Идеально", games: [] },
      { key: "1", id: "1", tier: "Супер", games: [] },
      { key: "2", id: "2", tier: "Отлично", games: [] },
      { key: "3", id: "3", tier: "Неинтересно", games: [] },
      { key: "4", id: "4", tier: "Ужасно", games: [] },
    ],
    tray: {
      games: [],
    },
  });
  const [activeGame, setActiveGame] = useState<IGameDis | null>(null);

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

  const getGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await gamesRequest({
        ...flagsParam,
      });
      const existingGamesInRows = tierData.rows.flatMap((row) => row.games);

      const newGames = response.data.results.map((game) => ({
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

      setTierData((prev) => ({ ...prev, tray: { games: newGames } }));
      setTotalCount(response.data.count);
      setLoading(false);
    } catch (error) {
      setTierData((prev) => ({ ...prev, tray: { games: [] } }));
      console.log((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [flagsParam]);

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
    if (tierData.tray.games.map((e) => e.id).includes(id)) {
      return "tray";
    }
    for (const row of tierData.rows) {
      if (row.games.map((e) => e.id).includes(id)) {
        return row.key;
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
            : prevData.rows.find((row) => row.key === activeContainer)!.games;

        const overItems =
          overContainer === "tray"
            ? prevData.tray.games
            : prevData.rows.find((row) => row.key.toString() === overContainer)!
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
          trayItems = overItems.map((game) =>
            game.id === `disable-${draggedGame.id}`
              ? { ...game, disabled: false }
              : game
          );
        }

        return {
          ...prevData,
          tray: { games: trayItems },
          rows: prevData.rows.map((row) => {
            if (row.key === activeContainer) {
              return { ...row, games: newActiveItems };
            }
            if (row.key === overContainer) {
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
            : prevData.rows.find((row) => row.key.toString() === overContainer)!
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

      let trayItems
      if (activeContainer === "tray"){
        trayItems = prevData.tray.games.map((item) =>
          item.id === activeId
            ? { ...item, disabled: true, id: `disable-${item.id}` }
            : item
        )} else if (overContainer === "tray"){
          trayItems = [
            ...prevData.tray.games.filter(
              (item) => item.id !== `disable-${draggedGame.id}`
            ),{...draggedGame, disabled: false,}
          ]
        } else {
          trayItems = prevData.tray.games
        }
     return {
        ...prevData,
        tray: {
          games:trayItems
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
     }
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
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <TierTable tierData={tierData.rows} changeIndex={handleChageIndexRow} />
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
          loading={loading}
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
      {!loading && tierData.tray.games.length === 0 ? (
        <p style={{ textAlign: "center" }}>Ничего не найдено</p>
      ) : (
        <CardList
          games={tierData.tray.games}
          loading={loading}
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
          <CardGame loading={loading} id={activeGame.id} game={activeGame} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default MainPage;
