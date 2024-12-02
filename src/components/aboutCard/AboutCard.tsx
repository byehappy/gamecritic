import { Pagination, Popover } from "antd";
import Search from "antd/es/input/Search";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import { IAboutGame } from "../../interfaces/aboutGames";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setMessage } from "../../redux/slice/messageSlice";
import { gameRequest, gamesRequest, updateAboutGame } from "../../axios";
import { IGame } from "../../interfaces/games";
import { FilterFlags } from "../../interfaces/filters";
import { DEFAULT_PAGE } from "../../utils/constans";
import { CardGame } from "../card/CardGame";

const AbouteCardWrapper = styled.div`
  width: 15vw;
  padding: 1%;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    max-width: 100%;
    height: 31vh;
  }
  div {
    width: 100%;
    height: 5vh;
    text-align: center;
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
      {change ? (
        <Popover
          open={open}
          onOpenChange={handleOpenChange}
          content={
            <div style={{ display: "grid", height: "30vh" }}>
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
                  display: "inline-flex",
                  gap: "1%",
                }}
              >
                {loading &&
                  SkeletonFactory(filterFlags.page_size, "Card-small")}
                {!loading &&
                  choiceGames?.map((game) => {
                    return (
                      <CardGame
                        key={game.id}
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
                    );
                  })}
              </div>
              <Pagination
                defaultCurrent={1}
                defaultPageSize={5}
                total={count ?? 1}
                pageSizeOptions={[5]}
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
          }
          placement="bottom"
          trigger="click"
          title={"Выбрать игру"}
        >
          <img
            src={valueGame?.background_image}
            alt={valueGame?.name}
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
        </Popover>
      ) : (
        <img
          src={valueGame?.background_image}
          alt={valueGame?.name}
          style={{ objectFit: "cover" }}
        />
      )}
      <div>
        {card.name}
        <br />
        {valueGame?.name}
      </div>
    </AbouteCardWrapper>
  );
};
