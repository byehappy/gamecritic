import { DEFAULT_TIMEOUT_REQUEST } from "./constans";

export const TimeoutRequest = <T>(asyncFunction: () => Promise<T>) => {
    const controller = new AbortController();
  const request = new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      asyncFunction().then(resolve).catch(reject);
    }, DEFAULT_TIMEOUT_REQUEST);
    controller.signal.addEventListener("abort",()=>{
      clearTimeout(timeoutId);
      reject(new Error("отмена"))
    })
  });
  return {
    request,
    cancel: ()=>controller.abort()
  }
};
