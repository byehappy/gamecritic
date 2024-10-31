import { Button, Checkbox, ColorPicker, Input } from "antd";
import { TierData } from "../../../interfaces/tierData";
import { Modal } from "../../modal/Modal";
import { useState } from "react";

export const RowSettings: React.FC<{
  id: string;
  tier: TierData;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  createNewTier: (index: number, direction: "up" | "down") => void;
  updateTier: (
    id: string,
    tierName?: string,
    color?: string,
    deleteGames?: boolean
  ) => void;
}> = ({ id, tier, index, isOpen, onClose, createNewTier, updateTier }) => {
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
      <div style={{ marginBottom: "1rem",display:"flex",alignItems:"center" }}>
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
      <div style={{display:"flex",gap:"2vh 0",flexDirection:"column"}}>
      <Button type="primary" onClick={handleSave}>
        Сохранить
      </Button>
      <div style={{ display: "flex", gap: "0.5rem",justifyContent:"space-between" }}>
        <Button onClick={() => createNewTier(index, "up")}>
          Добавить ряд сверху
        </Button>
        <Button onClick={() => createNewTier(index, "down")}>
          Добавить ряд снизу
        </Button>
      </div>
      </div>
    </Modal>
  );
};
