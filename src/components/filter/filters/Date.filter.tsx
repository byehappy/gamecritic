import { Space, DatePicker, Switch } from "antd";
import { FilterFlags } from "../../../interfaces/filters";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setFilter } from "../../../redux/slice/createTemplateSlice";

export const DateFilter: React.FC<{
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const { visible: visibleDate } = useAppSelector(
    (state) => state.createTemplate.filters.date
  );
  const dispatch = useAppDispatch();
  const location = useLocation();

  return (
    <Space wrap styles={{ item: { width: "100%" } }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        Дата выхода игры:
        {location.pathname === "/create-tierlist" && (
          <div>
            <Switch
              size="small"
              checked={visibleDate}
              onChange={() =>
                dispatch(
                  setFilter({ filter: "date", type: { visible: !visibleDate } })
                )
              }
              style={{ marginRight: ".1vw" }}
            />
            Отображать
          </div>
        )}
      </div>
      <DatePicker.RangePicker
        format={"YYYY-MM-DD"}
        style={{ width: "100%" }}
        onChange={(_, value) => {
          if (handleChangeFiters !== undefined) {
            if (location.pathname === "/create-tierlist")
              dispatch(
                setFilter({
                  filter: "date",
                  type: {
                    value: value.every((val) => val === "")
                      ? null
                      : value.join(","),
                  },
                })
              );
            handleChangeFiters(
              "dates",
              value.every((val) => val === "") ? null : value.join(",")
            );
          }
        }}
      />
    </Space>
  );
};
