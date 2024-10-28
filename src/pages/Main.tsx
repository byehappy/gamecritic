import { useCallback, useEffect, useState } from "react";
import { gamesRequest } from "../axios";
import { Button, Pagination } from "antd";
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
import { IGame } from "../interfaces/games";
import { CardGame } from "../components/Card/Card";
import { FilterFlags } from "../interfaces/filters";

const DefaultPage = 1;
const DefaultPageSize = 40;

function MainPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
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
  const [activeGame, setActiveGame] = useState<IGame | null>(null);

  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFlagsParam((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
    console.log(flagsParam);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await gamesRequest({
        ...flagsParam,
      });
      const existingGamesInRows = tierData.rows.flatMap((row) => row.games);

      const newGames = response.data.results.filter(
        (game: IGame) =>
          !existingGamesInRows.some(
            (existingGame) => existingGame.id === game.id
          )
      );

      setTierData((prev) => ({ ...prev, tray: { games: newGames } }));
      setTotalCount(response.data.count);
      setLoading(false);
    } catch (error: any) {
      console.log(error.toJSON());
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

  const findContainer = (id: any) => {
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
  const findGame = (id: number): IGame | undefined => {
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
          trayItems = newActiveItems;
        } else if (overContainer == "tray") {
          trayItems = newOverItems;
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
      const getOverItems = (containerId: string) =>
        containerId === "tray"
          ? prevData.tray.games
          : prevData.rows.find((row) => row.id === containerId)?.games || [];

      const overItems = getOverItems(overContainer);
      let newIndex;
      if (activeContainer === overContainer) {
        newIndex = overItems.length;
      } else {
        const overIndex = overItems.findIndex((game) => game.id === overId);
        const isBelowLastItem = overIndex === overItems.length - 1 ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + isBelowLastItem : overItems.length;
      }
      const updatedData: InitTierData = {
        ...prevData,
        tray: {
          games:
            activeContainer === "tray"
              ? prevData.tray.games.filter((item) => item.id !== activeId)
              : overContainer === "tray"
              ? [...prevData.tray.games, draggedGame]
              : prevData.tray.games,
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

      return updatedData;
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
      <TierTable tierData={tierData.rows} />
      <div style={{ display: "flex", gap: "1vh", marginTop: "2vh" }}>
        <Search
          placeholder="Введите название игры"
          enterButton="Поиск"
          onChange={(e) => handleChangeFiters("search", e.target.value)}
          size="large"
          onSearch={(value) => handleChangeFiters("search", value)}
          loading={loading}
        />
        <Button
          size="large"
          type="primary"
          onClick={showDrawer}
          icon={<FilterOutlined />}
        />
      </div>
      {loading ? (
        <CardList loading={loading} pageSize={flagsParam.page_size} />
      ) : (
        <CardList games={tierData.tray.games} loading={loading} />
      )}
      <Filter
        onClose={onClose}
        open={open}
        handleChangeFiters={handleChangeFiters}
      />
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
