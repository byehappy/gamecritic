import { DEFAULT_TIMEOUT_REQUEST } from "./constans";

export const TimeoutRequest = <T>(asyncFunction: () => Promise<T>) => {
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | null = null;
  let remaning = DEFAULT_TIMEOUT_REQUEST;
  let start: number | null = null;
  let resolverPromise: (value: T) => void;
  let rejectPromise: (reason?: Error) => void;

  const request = new Promise<T>((resolve, reject) => {
    resolverPromise = resolve;
    rejectPromise = reject;
    const startReq = () => {
      start = Date.now();
      timeoutId = setTimeout(() => {
        asyncFunction().then(resolve).catch(reject);
      }, remaning);
    };
    startReq();
    controller.signal.addEventListener("abort", () => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error("отмена"));
    });
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
