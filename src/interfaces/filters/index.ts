export type FilterValueType = string[] | string | null;
export interface FilterFlags {
  search?: string;
  date?: FilterValueType;
  genres?: FilterValueType;
  tags?: FilterValueType;
  platforms?: FilterValueType;
  page: number;
  page_size: number;
}
export type FilterType = { visible: boolean; value: string | null };
export interface FilterTierValue {
  genres?: FilterType;
  tags?: FilterType;
  platforms?: FilterType;
  date?: FilterType;
}
