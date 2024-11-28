import { Space, Select, Switch } from "antd";
import { useState, useCallback, useEffect } from "react";
import { tagsRequest } from "../../../axios";
import { FilterFlags } from "../../../interfaces/filters";
import { TreeDataState } from "../../../interfaces/filters/filterState";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setFilter } from "../../../redux/slice/createTemplateSlice";

export const TagFilter: React.FC<{
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const [tags, setTags] = useState<TreeDataState[]>();
  const { tags: initTags } = useAppSelector((state) => state.tierData.filters);
  const valueArray = initTags?.value?.split(",");
  const { visible: visibleTags } = useAppSelector(
    (state) => state.createTemplate.filters.tags
  );
  const dispatch = useAppDispatch();
  const location = useLocation();

  const getTags = useCallback(async () => {
    const res = await tagsRequest();
    setTags(
      res.data.results.map((tag) => ({
        label: tag.name,
        value: tag.slug,
      }))
    );
  }, []);

  useEffect(() => {
    getTags();
  }, [getTags]);
  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Тэги:
        {location.pathname === "/create-tierlist" && (
          <div>
            <Switch
              size="small"
              checked={visibleTags}
              onChange={() =>
                dispatch(
                  setFilter({ filter: "tags", type: { visible: !visibleTags } })
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
        placeholder="Выберите тэг"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        defaultValue={valueArray}
        options={tags}
        onChange={(value) => {
          if (handleChangeFiters !== undefined) {
            if (location.pathname === "/create-tierlist")
              dispatch(
                setFilter({
                  filter: "tags",
                  type: {
                    value: value.every((val: string) => val === "")
                      ? null
                      : value.join(","),
                  },
                })
              );
            handleChangeFiters(
              "tags",
              value.every((val: string) => val === "") ? null : value.join(",")
            );
          }
        }}
      />
    </Space>
  );
};
