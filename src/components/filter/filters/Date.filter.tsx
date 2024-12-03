import { Space, DatePicker, Switch } from "antd";
import { FilterFlags } from "../../../interfaces/filters";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setFilter } from "../../../redux/slice/createTemplateSlice";
import dayjs from "dayjs";
export const DateFilter: React.FC<{
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({ handleChangeFiters }) => {
  const { visible: visibleDate } = useAppSelector(
    (state) => state.createTemplate.filters.dates
  );
  const { dates } = useAppSelector((state) => state.tierData.filters);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const valueArray = dates?.value?.split(",");
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
                  setFilter({ filter: "dates", type: { visible: !visibleDate } })
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
        defaultValue={
          location.pathname !== "/create-tierlist" && valueArray
            ? [dayjs(valueArray[0]), dayjs(valueArray[1])]
            : undefined
        }
        onChange={(_, value) => {
          if (handleChangeFiters !== undefined) {
            if (location.pathname === "/create-tierlist")
              dispatch(
                setFilter({
                  filter: "dates",
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
