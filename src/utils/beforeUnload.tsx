import { useCallback, useEffect } from "react";
import { SaveTierData } from "../interfaces/tierData";
import { useBlocker } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const useBeforeUnloadSave = (
  rows: SaveTierData[],
  params: string,
  dirty: boolean
) => {
  const {user:currentUser } = useAppSelector(state => state.auth)
  const blocker = useBlocker(dirty);
  const handleSaveData = useCallback(async () => {
    if (dirty && !currentUser) {
      sessionStorage.setItem(params, JSON.stringify(rows));
    }
  }, [currentUser, dirty, params, rows]);
  useEffect(() => {
    if (blocker.state === "blocked") {
      handleSaveData();
      blocker.proceed();
    }
  }, [blocker, handleSaveData]);
  useEffect(() => {
    window.addEventListener("beforeunload", handleSaveData);
    return () => {
      window.removeEventListener("beforeunload", handleSaveData);
    };
  }, [handleSaveData]);

  return null;
};
