import { useSetup } from "./useSanity";

/**
 * 
 * @param {*} time 
 * @param {*} callback 
 */
export const useInterval = (time, callback) => {
  useSetup(() => {
    let interval;
    const clear = () => clearInterval(interval);
    interval = setInterval(() => callback(clear), time);
    return clear;
  });
};
