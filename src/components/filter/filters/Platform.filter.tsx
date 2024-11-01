import { Space, Select } from "antd";
import { useState, useCallback, useEffect } from "react";
import { platformsRequest } from "../../../axios";
import { FilterFlags } from "../../../interfaces/filters";
import { TreeDataState } from "../../../interfaces/filters/filterState";
import { platformIcons } from "../../../assets/icons/platfroms";

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
      res.data.results.map((platform) => {
        const IconComponent =  platformIcons[platform.name as keyof typeof platformIcons] || platformIcons.Global
        
        return {
          label: platform.name,
          value: platform.id,
          icon:<IconComponent/>,
        };
      })
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
        optionRender={(option) => (
          <Space>
            {option.data.icon}
            {option.data.label}
          </Space>
        )}
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
