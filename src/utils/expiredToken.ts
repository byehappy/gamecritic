import { AxiosError } from "axios";
import {jwtDecode} from "jwt-decode";
import { store } from "../redux/store";
import { setMessage } from "../redux/slice/messageSlice";

interface TokenData {
    exp: number;
}

export function decodeToken(): TokenData | null {
    const accessToken = localStorage.getItem("accessToken")
    if( !accessToken){
        store.dispatch(setMessage(new AxiosError("Токен не найден").message))
        return null
    }
    return jwtDecode(accessToken);
}