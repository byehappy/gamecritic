import { FilterFlags } from "../../interfaces/filters";
import { DateFilter } from "./filters/Date.filter";
import { GenreFilter } from "./filters/Genre.filter";
import { TagFilter } from "./filters/Tags.filter";
import { PlatformFilter } from "./filters/Platform.filter";

interface FilterProps {
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
}

export const Filter: React.FC<FilterProps> = ({ handleChangeFiters }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <DateFilter handleChangeFiters={handleChangeFiters} />
      <GenreFilter handleChangeFiters={handleChangeFiters} />
      <TagFilter handleChangeFiters={handleChangeFiters} />
      <PlatformFilter handleChangeFiters={handleChangeFiters} />
    </div>
  );
};
