import { setMessage } from "../redux/slice/messageSlice";
import { store } from "../redux/store";
import { DEFAULT_TIMEOUT_REQUEST } from "./constans";

type ActiveReq = {
  [key: string]: AbortController;
};
const activeReq: ActiveReq = {};

export const TimeoutRequest = <T>(
  asyncFunction: () => Promise<T>,
  tierId?: string
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let remaning = DEFAULT_TIMEOUT_REQUEST;
  let start: number | null = null;
  let resolverPromise: (value: T) => void;
  let rejectPromise: (reason?: Error) => void;
  if (tierId && activeReq[tierId]) {
    activeReq[tierId].abort();
    return null;
  }
  const controller = new AbortController();
  if (tierId && !activeReq[tierId]) {
    activeReq[tierId] = controller;
  }
  const request = new Promise<T>((resolve, reject) => {
    resolverPromise = resolve;
    rejectPromise = reject;
    const startReq = () => {
      start = Date.now();
      timeoutId = setTimeout(() => {
        asyncFunction()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            if (tierId) delete activeReq[tierId];
          });
      }, remaning);
    };
    startReq();
    controller.signal.addEventListener("abort", () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (tierId) delete activeReq[tierId];
      const error = new Error();
      error.message = "Отменено";
      error.name = "Cancel";
      return reject(error);
    });
  }).catch((error) => {
    if (error.name !== "Cancel") store.dispatch(setMessage(error));
  });
  const pause = () => {
    if (timeoutId && start !== null) {
      clearTimeout(timeoutId);
      remaning -= Date.now() - start;
      timeoutId = null;
    }
  };
  const resume = () => {
    if (!timeoutId) {
      start = Date.now();
      timeoutId = setTimeout(() => {
        asyncFunction().then(resolverPromise).catch(rejectPromise);
      }, remaning);
    }
  };
  return {
    request,
    cancel: () => controller.abort(),
    pause,
    resume,
  };
};
