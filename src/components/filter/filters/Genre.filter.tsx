import { Select, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { genresRequest } from "../../../axios";
import { TreeDataState } from "../../../interfaces/filters/filterState";
import { FilterFlags } from "../../../interfaces/filters";

export const GenreFilter: React.FC<{
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const [genres, setGenres] = useState<TreeDataState[]>();

  const getGenres = useCallback(async () => {
    const res = await genresRequest();
    setGenres(
      res.data.results.map((genre) => ({
        label: genre.name,
        value: genre.slug,
      }))
    );
  }, []);

  useEffect(() => {
    getGenres();
  }, [getGenres]);

  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      Жанр:
      <Select
        mode="multiple"
        placeholder="Выберите жанр"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        options={genres}
        onChange={(value) =>
          handleChangeFiters(
            "genres",
            value.every((val: string) => val === "") ? null : value.join(",")
          )
        }
      />
    </Space>
  );
};
