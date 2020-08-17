/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"

export const useSetup = (effect) => {
  useEffect(effect, []);
};

export const useUpdates = useEffect;
export const useAsyncUpdates = (asyncFunc, deps) => {
  useEffect(() => {
    asyncFunc();
  }, deps);
};

export const useTeardown = (effect) => {
  useEffect(() => effect, []);
};
