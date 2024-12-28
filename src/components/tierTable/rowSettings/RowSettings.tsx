import { Button, ColorPicker, Input } from "antd";
import { TierData } from "../../../interfaces/tierData";
import { Modal } from "../../modal/Modal";
import uuid4 from "uuid4";
import { IGameDis } from "../../../interfaces/games";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setRows, setTrayGames } from "../../../redux/slice/tierDataSlice";
import { ExampleRow } from "../../exampleRow/ExampleRow";
import styled, { useTheme } from "styled-components";
import { useState } from "react";
const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: 55% 42%;
  gap: 10px;
`;
export const RowSettings: React.FC<{
  id: string;
  tier: TierData;
  index: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ id, tier, index, isOpen, onClose }) => {
  const theme = useTheme();
  const tierData = useAppSelector((state) => state.tierData);
  const dispatch = useAppDispatch();
  const findedTier = tierData.rows.find((tier) => id === tier.id);
  const [confirmModal, setConfirmModal] = useState<string>();
  function enabledGamesInTray(
    games: IGameDis[],
    findedTier?: TierData
  ): IGameDis[] {
    return games.map((game) =>
      findedTier?.games.some((tierGame) => game.id === `disable-${tierGame.id}`)
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
    const findedTier = tierData.rows[index];
    const newId = uuid4();
    const newTier = {
      id: newId,
      name: "Новое",
      games: [],
      color: "#1677FF",
    };
    const updateTiers = [...tierData.rows];
    if (deleteTier) {
      updateTiers.splice(index, 1);
    } else {
      const insertIndex = direction === "up" ? index : index + 1;
      updateTiers.splice(insertIndex, 0, newTier);
    }
    dispatch(setRows(updateTiers));
    dispatch(
      setTrayGames(
        deleteTier
          ? enabledGamesInTray(tierData.games, findedTier)
          : tierData.games
      )
    );
  };
  function clearGames() {
    dispatch(
      setRows(
        tierData.rows.map((tier) =>
          tier.id === id
            ? {
                ...tier,
                games: [],
              }
            : tier
        )
      )
    );
    dispatch(setTrayGames(enabledGamesInTray(tierData.games, findedTier)));
  }
  const updateTier = (tierName?: string, color?: string) => {
    dispatch(
      setRows(
        tierData.rows.map((tier) =>
          tier.id === id
            ? {
                ...tier,
                name: tierName ?? tier.name,
                color: color ?? tier.color,
              }
            : tier
        )
      )
    );
  };
  return (
    <Modal
      key={`${id}-modal`}
      isOpen={isOpen}
      onClose={onClose}
      widthMin={true}
    >
      <div style={{ display: "flex", marginBottom: "1vh", gap: "5%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Input
            placeholder="Название"
            value={tier.name}
            onChange={(e) => updateTier(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: theme.colors.font,
            }}
          >
            Цвет:
            <ColorPicker
              value={tier.color}
              onChangeComplete={(color) =>
                updateTier(undefined, color.toHexString())
              }
            />
          </div>
        </div>
        <div style={{ width: "45%", display: "flex", justifyContent: "end" }}>
          <ExampleRow name={tier.name} color={tier.color} />
        </div>
      </div>
      <ButtonsWrapper>
        <Button onClick={() => handleManipulatorTier(index, "up")}>
          Добавить ряд сверху
        </Button>
        <Button
          danger
          onClick={() => {
            setConfirmModal("clear");
          }}
        >
          Очистить игры
        </Button>
        <Button onClick={() => handleManipulatorTier(index, "down")}>
          Добавить ряд снизу
        </Button>
        <Button
          danger
          type="primary"
          onClick={() => {
            setConfirmModal("delete");
          }}
        >
          Удалить ряд
        </Button>
        {confirmModal && (
          <Modal
            key={`second-modal`}
            isOpen={confirmModal.length > 0}
            onClose={() => setConfirmModal("")}
            widthMin={true}
            zIndex={101}
          >
              {confirmModal === "clear" ? (
              <div style={{minWidth:"40vw"}}>
                <div style={{ fontSize: theme.fontSizes.normal }}>
                  Вы точно хотите очистить все игры?
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5%",
                  }}
                >
                  <Button
                    danger
                    type="primary"
                    style={{ width: "45%" }}
                    onClick={() => {
                      clearGames();
                      onClose();
                    }}
                  >
                    Очистить
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: "45%" }}
                    onClick={() => {
                      setConfirmModal("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{minWidth:"40vw"}}>
                <div style={{ fontSize: theme.fontSizes.normal }}>
                  Вы точно хотите удалить данный ряд?
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5%",
                  }}
                >
                  <Button
                    danger
                    type="primary"
                    style={{ width: "45%" }}
                    onClick={() => {
                      setConfirmModal("");
                      handleManipulatorTier(index, undefined, true);
                      onClose();
                    }}
                  >
                    Удалить
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: "45%" }}
                    onClick={() => {
                      setConfirmModal("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </ButtonsWrapper>
    </Modal>
  );
};
