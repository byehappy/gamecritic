import { Space, DatePicker } from "antd";
import { FilterFlags } from "../../../interfaces/filters";

export const DateFilter: React.FC<{
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}> = ({handleChangeFiters}) => {
  return (
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
  );
};
