import { Drawer, DatePicker, Space, TreeSelect, TreeSelectProps } from "antd";
import instance from "../../axios";
import { useEffect, useState } from "react";
import { IGenres } from "../../interfaces/genres";
import { RangePickerProps } from "antd/es/date-picker/generatePicker/interface";
import { ITags } from "../../interfaces/tags";

interface FilterProps {
  onClose: () => void;
  open: boolean;
  handleDateChange: RangePickerProps["onChange"];
  handleGenresChange: TreeSelectProps["onChange"];
  handleTagsChange: TreeSelectProps["onChange"]
}

interface TreeDataState {
  value: string;
  title: string;
}

export const Filter: React.FC<FilterProps> = ({
  onClose,
  open,
  handleDateChange,
  handleGenresChange,
  handleTagsChange
}) => {
  const [treeDataGenres, setTreeDataGenres] = useState<TreeDataState[]>();
  const [treeDataTags, setTreeDataTags] = useState<TreeDataState[]>();
  const { instanceGenres,instanceTags } = instance;

  useEffect(() => {
    instanceGenres.get("").then((res) => {
      const resArray = res.data.results.map((genre: IGenres) => ({
        title: genre.name,
        value: genre.slug,
      }));
      setTreeDataGenres(resArray);
    });
    instanceTags.get("").then((res) => {
      const resArray = res.data.results.map((tag: ITags) => ({
        title: tag.name,
        value: tag.slug,
      }));
      setTreeDataTags(resArray);
    });
  }, [instanceGenres,instanceTags]);

  return (
    <Drawer title="Фильтры" onClose={onClose} open={open}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Space wrap>
          Дата выхода игры:
          <DatePicker.RangePicker
            format={"YYYY-MM-DD"}
            onChange={handleDateChange}
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
            onChange={handleGenresChange}
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
            onChange={handleTagsChange}
          />
        </Space>
      </div>
    </Drawer>
  );
};
