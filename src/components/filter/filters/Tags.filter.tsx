import { Space, Select } from "antd";
import { useState, useCallback, useEffect } from "react";
import { tagsRequest } from "../../../axios";
import { FilterFlags } from "../../../interfaces/filters";
import { TreeDataState } from "../../../interfaces/filters/filterState";

export const TagFilter : React.FC<{
    handleChangeFiters: (
      param: keyof FilterFlags,
      value: string | string[] | number | null
    ) => void;
  }> = ({ handleChangeFiters }) => {
    const [tags, setTags] = useState<TreeDataState[]>();
  
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
      Тэги:
      <Select
        mode="multiple"
        placeholder="Выберите тэг"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        options={tags}
        onChange={(value) =>
          handleChangeFiters(
            "tags",
            value.every((val: string) => val === "") ? null : value.join(",")
          )
        }
      />
    </Space>
  );
};
