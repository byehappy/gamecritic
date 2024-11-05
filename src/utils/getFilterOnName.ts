import { FilterTierType } from "../interfaces/filters"

export default function (tierType:string):FilterTierType | undefined {
    switch(tierType) {
        case 'main':
            return {name:"Все игры"}
        case "RPG":
            return {
                name:"Лучшее РПГ",
                filters:{
                    genres:"role-playing-games-rpg"
                }
            }
        case "Singleplayer":
            return {
                name: "Лучшие одиночные игры",
                filters:{
                    tags:"singleplayer"
                }
            }
    } 
}