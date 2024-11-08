import { Button, Checkbox, ColorPicker, Input } from "antd";
import { TierData } from "../../../interfaces/tierData";
import { Modal } from "../../modal/Modal";
import { useState } from "react";
import uuid4 from "uuid4";
import { IGameDis } from "../../../interfaces/games";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setRows, setTrayGames } from "../../../redux/slice/tierDataSlice";

export const RowSettings: React.FC<{
  id: string;
  tier: TierData;
  index: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({
  id,
  tier,
  index,
  isOpen,
  onClose
}) => {
  const tierData = useAppSelector((state) => state.tierData);
  const dispatch = useAppDispatch();
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
      tier: "Новое",
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
  const updateTier = (
    id: string,
    tierName?: string,
    color: string = "primary",
    deleteGames: boolean = false
  ) => {
    const findedTier = tierData.rows.find((tier) => id === tier.id);
    dispatch(
      setRows(
        tierData.rows.map((tier) =>
          tier.id === id
            ? {
                ...tier,
                tier: tierName ?? tier.tier,
                color,
                games: deleteGames ? [] : tier.games,
              }
            : tier
        )
      )
    );
    dispatch(
      setTrayGames(
        deleteGames
          ? enabledGamesInTray(tierData.games, findedTier)
          : tierData.games
      )
    );
  };
  const [settingsRow, setSettingsRow] = useState({
    tierName: tier.tier,
    color: tier.color,
    deleteGames: false,
  });
  const handleSave = () => {
    updateTier(
      id,
      settingsRow.tierName,
      settingsRow.color,
      settingsRow.deleteGames
    );
    onClose();
  };
  return (
    <Modal key={`${id}-modal`} isOpen={isOpen} onClose={onClose}>
      <div style={{ marginBottom: "1rem" }}>
        <Input
          placeholder="Название tier"
          value={settingsRow.tierName}
          onChange={(e) =>
            setSettingsRow((prev) => ({ ...prev, tierName: e.target.value }))
          }
        />
      </div>
      <div
        style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
      >
        Цвет:
        <ColorPicker
          value={settingsRow.color}
          onChange={(color) =>
            setSettingsRow((prev) => ({ ...prev, color: color.toHexString() }))
          }
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <Checkbox
          onChange={(e) =>
            setSettingsRow((prev) => ({
              ...prev,
              deleteGames: e.target.checked,
            }))
          }
        >
          Очистить игры
        </Checkbox>
      </div>
      <div style={{ display: "flex", gap: "2vh 0", flexDirection: "column" }}>
        <Button type="primary" onClick={handleSave}>
          Сохранить
        </Button>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => handleManipulatorTier(index, "up")}>
            Добавить ряд сверху
          </Button>
          <Button
            danger
            type="primary"
            onClick={() => {
              handleManipulatorTier(index, undefined, true);
              onClose();
            }}
          >
            Удалить ряд
          </Button>
          <Button onClick={() => handleManipulatorTier(index, "down")}>
            Добавить ряд снизу
          </Button>
        </div>
      </div>
    </Modal>
  );
};
