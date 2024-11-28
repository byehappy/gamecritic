import { Select, Space, Switch } from "antd";
import { useCallback, useEffect, useState } from "react";
import { genresRequest } from "../../../axios";
import { TreeDataState } from "../../../interfaces/filters/filterState";
import { FilterFlags } from "../../../interfaces/filters";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setFilter } from "../../../redux/slice/createTemplateSlice";

export const GenreFilter: React.FC<{
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const [genres, setGenres] = useState<TreeDataState[]>();
  const { genres:initGenres } = useAppSelector((state) => state.tierData.filters);
  const valueArray = initGenres?.value?.split(",");
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
  const { visible: visibleGenre } = useAppSelector(
    (state) => state.createTemplate.filters.genres
  );
  const dispatch = useAppDispatch();
  const location = useLocation();
  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Жанр:
        {location.pathname === "/create-tierlist" && (
          <div>
            <Switch
              size="small"
              checked={visibleGenre}
              onChange={() =>
                dispatch(
                  setFilter({
                    filter: "genres",
                    type: { visible: !visibleGenre },
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
        placeholder="Выберите жанр"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        allowClear
        options={genres}
        defaultValue={location.pathname !== "/create-tierlist" ? valueArray : null}
        onChange={(value) => {
          if (handleChangeFiters !== undefined) {
            if (location.pathname === "/create-tierlist")
              dispatch(
                setFilter({
                  filter: "genres",
                  type: {
                    value: value.every((val: string) => val === "")
                      ? null
                      : value.join(","),
                  },
                })
              );
            handleChangeFiters(
              "genres",
              value.every((val: string) => val === "") ? null : value.join(",")
            );
          }
        }}
      />
    </Space>
  );
};
