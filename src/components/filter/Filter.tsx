import { FilterFlags, FilterTierValue } from "../../interfaces/filters";
import { DateFilter } from "./filters/Date.filter";
import { GenreFilter } from "./filters/Genre.filter";
import { TagFilter } from "./filters/Tags.filter";
import { PlatformFilter } from "./filters/Platform.filter";

interface FilterProps {
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
  filters?: FilterTierValue;
}

export const Filter: React.FC<FilterProps> = ({
  handleChangeFiters,
  filters = {
    date: { visible: true },
    genres: { visible: true },
    platforms: { visible: true },
    tags: { visible: true },
  },
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {filters?.date?.visible ? (
        <DateFilter handleChangeFiters={handleChangeFiters} />
      ) : null}
      {filters?.genres?.visible ? (
        <GenreFilter handleChangeFiters={handleChangeFiters} />
      ) : null}
      {filters?.tags?.visible ? (
        <TagFilter handleChangeFiters={handleChangeFiters} />
      ) : null}
      {filters?.platforms?.visible ? (
        <PlatformFilter handleChangeFiters={handleChangeFiters} />
      ) : null}
      {!filters?.date?.visible &&
        !filters.genres?.visible &&
        !filters.platforms?.visible &&
        !filters.tags?.visible && <div>Фильтры выключены</div>}
    </div>
  );
};
