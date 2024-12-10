import { useContext } from "react"
import { ToasterContext } from "../Toaster"

export const useToaster = () => {
    const context = useContext(ToasterContext)
    if(!context) {
        throw new Error("контекст не найден")
    };
    return context
} 