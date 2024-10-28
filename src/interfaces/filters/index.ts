export interface FilterFlags {
    search?:string ,
    dates?: string,
    genres?: string[] ,
    tags?:string[] ,
    platforms?: string[],
    page:number,
    page_size:number
}