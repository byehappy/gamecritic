import { Drawer, DatePicker, Space, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { IGenres } from "../../interfaces/filters/genres";
import { ITags } from "../../interfaces/filters/tags";
import { FilterFlags } from "../../interfaces/filters";
import { rawgRequest } from "../../axios";

interface FilterProps {
  onClose: () => void;
  open: boolean;
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}

interface TreeDataState {
  value: string;
  title: string;
}

export const Filter: React.FC<FilterProps> = ({
  onClose,
  open,
  handleChangeFiters,
}) => {
  const [treeDataGenres, setTreeDataGenres] = useState<TreeDataState[]>();
  const [treeDataTags, setTreeDataTags] = useState<TreeDataState[]>();

  useEffect(() => {
    rawgRequest("/genres").then((res) => {
      const resArray = res.data.results.map((genre: IGenres) => ({
        title: genre.name,
        value: genre.slug,
      }));
      setTreeDataGenres(resArray);
    });
    rawgRequest("/tags").then((res) => {
      const resArray = res.data.results.map((tag: ITags) => ({
        title: tag.name,
        value: tag.slug,
      }));
      setTreeDataTags(resArray);
    });
  }, []);

  return (
    <Drawer title="Фильтры" onClose={onClose} open={open}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Space wrap>
          Дата выхода игры:
          <DatePicker.RangePicker
            format={"YYYY-MM-DD"}
            onChange={(_, value) =>
              handleChangeFiters(
                "dates",
                value.every((val) => val === "") ? null : value.join(",")
              )
            }
          />
        </Space>
        <Space wrap styles={{ item: { width: "100%" } }}>
          Жанр:
          <TreeSelect
            placeholder="Выберите жанр"
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            allowClear
            multiple
            treeData={treeDataGenres}
            onChange={(value) =>
              handleChangeFiters(
                "genres",
                value.every((val:string) => val === "") ? null : value.join(",")
              )
            }
          />
        </Space>
        <Space wrap styles={{ item: { width: "100%" } }}>
          Тэги:
          <TreeSelect
            placeholder="Выберите тэг"
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            allowClear
            multiple
            treeData={treeDataTags}
            onChange={(value) =>
              handleChangeFiters(
                "tags",
                value.every((val:string) => val === "") ? null : value.join(",")
              )
            }
          />
        </Space>
      </div>
    </Drawer>
  );
};
