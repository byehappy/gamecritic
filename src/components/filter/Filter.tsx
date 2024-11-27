import { FilterFlags } from "../../interfaces/filters";
import { DateFilter } from "./filters/Date.filter";
import { GenreFilter } from "./filters/Genre.filter";
import { TagFilter } from "./filters/Tags.filter";
import { PlatformFilter } from "./filters/Platform.filter";

interface FilterProps {
  handleChangeFiters?: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
  filters?: {
    date?: string;
    genres?: string;
    platforms?: string;
    tags?: string;
  };
}

export const Filter: React.FC<FilterProps> = ({
  handleChangeFiters,
  filters,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {filters?.date ? null : (
        <DateFilter handleChangeFiters={handleChangeFiters} />
      )}
      {filters?.genres ? null : (
        <GenreFilter handleChangeFiters={handleChangeFiters} />
      )}
      {filters?.tags ? null : (
        <TagFilter handleChangeFiters={handleChangeFiters} />
      )}
      {filters?.platforms ? null : (
        <PlatformFilter handleChangeFiters={handleChangeFiters} />
      )}
      {filters?.date && filters.genres && filters.platforms && filters.tags && (
        <div>Фильтры выключены</div>
      )}
    </div>
  );
};
