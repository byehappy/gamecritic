import { useCallback, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { SaveTierData } from "../interfaces/tierData";
import { updateUserRows } from "../axios";
import { useBlocker, useLocation } from "react-router-dom";
import { store } from "../redux/store";
import { setMessage } from "../redux/slice/messageSlice";


export const useBeforeUnloadSave = (
  rows: SaveTierData[],
  params: string,
  dirty: boolean
) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname
  );
  const handleSaveData = useCallback(async () => {
    if (dirty) {
      if (user) {
        try {
          await updateUserRows(user.id, params, JSON.stringify(rows));
        } catch  {
          sessionStorage.setItem(params, JSON.stringify(rows));
          store.dispatch(setMessage({message:"Для того чтобы сохранить результат необходимо авторизоваться"}));
        }
      } else {
        sessionStorage.setItem(params, JSON.stringify(rows));
      }
    }
  }, [dirty, params, rows, user]);
  useEffect(() => {
    if (blocker.state === "blocked") {
      handleSaveData();
      blocker.proceed();
    }
  }, [location, blocker, handleSaveData]);
  useEffect(() => {
    window.addEventListener("beforeunload", handleSaveData);
    return () => {
      window.removeEventListener("beforeunload", handleSaveData);
    };
  }, [handleSaveData]);

  return null;
};
