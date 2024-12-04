export type FilterValueType = string[] | string | null;
export interface FilterFlags {
  search?: string;
  dates?: FilterValueType;
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
  dates?: FilterType;
}
