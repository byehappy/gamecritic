import { Drawer, DatePicker, Space, TreeSelect } from "antd";
import { useCallback, useEffect, useState } from "react";
import { FilterFlags } from "../../interfaces/filters";
import { genresRequest, platformsRequest, tagsRequest } from "../../axios/requests/games.requests";

interface FilterProps {
  onClose: () => void;
  open: boolean;
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}

interface TreeDataState {
  value: string | number;
  title: string;
}

export const Filter: React.FC<FilterProps> = ({
  onClose,
  open,
  handleChangeFiters,
}) => {
  const [treeDataGenres, setTreeDataGenres] = useState<TreeDataState[]>();
  const [treeDataTags, setTreeDataTags] = useState<TreeDataState[]>();
  const [treeDataPlatform, setTreeDataPlatform] = useState<TreeDataState[]>();
  
  const fetchData = useCallback(async () => {
    try {
      const [genresRes, tagsRes, platformsRes] = await Promise.all([
        genresRequest(),
        tagsRequest(),
        platformsRequest()
      ]);
  
      setTreeDataGenres(
        genresRes.data.results.map((genre) => ({
          title: genre.name,
          value: genre.slug
        }))
      );
  
      setTreeDataTags(
        tagsRes.data.results.map((tag) => ({
          title: tag.name,
          value: tag.slug
        }))
      );
  
      setTreeDataPlatform(
        platformsRes.data.results.map((platform) => ({
          title: platform.name,
          value: platform.id
        }))
      );
    } catch (error: any) {
      console.error(error.toJSON());
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        <Space wrap styles={{ item: { width: "100%" } }}>
          Платформы:
          <TreeSelect
            placeholder="Выберите платформу"
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            allowClear
            multiple
            treeData={treeDataPlatform}
            onChange={(value) =>
              handleChangeFiters(
                "platforms",
                value.every((val:string) => val === "") ? null : value.join(",")
              )
            }
          />
        </Space>
      </div>
    </Drawer>
  );
};
