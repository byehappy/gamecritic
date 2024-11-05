export interface FilterFlags {
  search?: string;
  dates?: string;
  genres?: string[] | string;
  tags?: string[] | string;
  platforms?: string[] | string;
  page: number;
  page_size: number;
}

export interface FilterTierType {
  name: string;
  filters?: {
    genres?: string[] | string;
    tags?: string[] | string;
    platforms?: string[] | string;
  };
}
