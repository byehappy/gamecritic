import { FilterFlags, FilterTierType } from "../../interfaces/filters";
import { DateFilter } from "./filters/Date.filter";
import { GenreFilter } from "./filters/Genre.filter";
import { TagFilter } from "./filters/Tags.filter";
import { PlatformFilter } from "./filters/Platform.filter";

interface FilterProps {
  handleChangeFiters: (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => void;
  filterFlags:FilterTierType | undefined;
}

export const Filter: React.FC<FilterProps> = ({
  handleChangeFiters,filterFlags
}) => {

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <DateFilter handleChangeFiters={handleChangeFiters}/>
        {filterFlags?.genres ? null : <GenreFilter handleChangeFiters={handleChangeFiters}/>}
        {filterFlags?.tags? null : <TagFilter handleChangeFiters={handleChangeFiters}/>}
        {filterFlags?.platforms ? null : <PlatformFilter handleChangeFiters={handleChangeFiters}/>}
      </div>
  );
};
