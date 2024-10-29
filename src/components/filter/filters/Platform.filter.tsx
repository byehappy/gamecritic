import { Space, Select } from "antd";
import { useState, useCallback, useEffect } from "react";
import { platformsRequest } from "../../../axios";
import { FilterFlags } from "../../../interfaces/filters";
import { TreeDataState } from "../../../interfaces/filters/filterState";

export const PlatformFilter: React.FC<{
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const [platforms, setPlatforms] = useState<TreeDataState[]>();

  const getPlatforms = useCallback(async () => {
    const res = await platformsRequest();
    setPlatforms(
      res.data.results.map((platform) => ({
        label: platform.name,
        value: platform.id,
      }))
    );
  }, []);

  useEffect(() => {
    getPlatforms();
  }, [getPlatforms]);
  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      Платформы:
      <Select
        mode="multiple"
        placeholder="Выберите платформу"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        options={platforms}
        onChange={(value) =>
          handleChangeFiters(
            "platforms",
            value.every((val: string) => val === "") ? null : value.join(",")
          )
        }
      />
    </Space>
  );
};
