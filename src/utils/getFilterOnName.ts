import { FilterTierType } from "../interfaces/filters"

export default function (tierType:string):FilterTierType | undefined {
    switch(tierType) {
        case 'main':
            return {}
        case "RPG":
            return {
                genres:"role-playing-games-rpg"
            }
    } 
}