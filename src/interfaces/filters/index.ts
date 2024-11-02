export interface FilterFlags {
  search?: string;
  dates?: string;
  genres?: string[] | string;
  tags?: string[] | string;
  platforms?: string[] | string;
  page: number;
  page_size: number;
}

export interface FilterTierType{
  genres?: string[] | string;
  tags?: string[] | string;
  platforms?: string[] | string;
}