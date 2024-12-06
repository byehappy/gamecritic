import { Space, Select, Switch } from "antd";
import { useState, useCallback, useEffect } from "react";
import { platformsRequest } from "../../../axios";
import { FilterFlags } from "../../../interfaces/filters";
import { TreeDataState } from "../../../interfaces/filters/filterState";
import { platformIcons } from "../../../assets/icons/platfroms";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setFilter } from "../../../redux/slice/createTemplateSlice";

export const PlatformFilter: React.FC<{
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const [platforms, setPlatforms] = useState<TreeDataState[]>();
  const { platforms: initPlatforms } = useAppSelector(
    (state) => state.tierData.filters
  );
  const valueArray: number[] | undefined = initPlatforms?.value
    ?.split(",")
    .map(Number);

  const getPlatforms = useCallback(async () => {
    const res = await platformsRequest();
    setPlatforms(
      res.data.results.map((platform) => {
        const IconComponent =
          platformIcons[platform.name as keyof typeof platformIcons] ||
          platformIcons.Global;

        return {
          label: platform.name,
          value: platform.id,
          icon: <IconComponent />,
        };
      })
    );
  }, []);

  useEffect(() => {
    getPlatforms();
  }, [getPlatforms]);
  const { visible: visiblePlatform } = useAppSelector(
    (state) => state.createTemplate.filters.platforms
  );
  const dispatch = useAppDispatch();
  const location = useLocation();
  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Платформы:
        {(location.pathname === "/create-tierlist" ||location.pathname.includes("/update-tierlist")) && (
          <div>
            <Switch
              size="small"
              checked={visiblePlatform}
              onChange={() =>
                dispatch(
                  setFilter({
                    filter: "platforms",
                    type: { visible: !visiblePlatform },
                  })
                )
              }
              style={{ marginRight: ".1vw" }}
            />
            Отображать
          </div>
        )}
      </div>
      <Select
        mode="multiple"
        placeholder="Выберите платформу"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        options={platforms}
        defaultValue={location.pathname !== "/create-tierlist" ? valueArray : null}
        optionRender={(option) => (
          <Space>
            {option.data.icon}
            {option.data.label}
          </Space>
        )}
        onChange={(value) => {
          if (handleChangeFiters !== undefined) {
            if ((location.pathname === "/create-tierlist" ||location.pathname.includes("/update-tierlist")))
              dispatch(
                setFilter({
                  filter: "platforms",
                  type: {
                    value: value.every((val) => val.toString() === "")
                      ? null
                      : value.join(","),
                  },
                })
              );
            handleChangeFiters(
              "platforms",
              value.every((val) => val.toString() === "")
                ? null
                : value.join(",")
            );
          }
        }}
      />
    </Space>
  );
};
