import { useGameContext } from "./gameContext";
import { useTeardown, useUpdates } from "./useSanity";

export const useMessage = (action, handler, deps = []) => {
  const { client } = useGameContext();

  useUpdates(() => {
    client.addMessageHandler(action, handler);
  }, deps);

  useTeardown(() => {
    console.log(`[useMessage Teardown] ${action}`);
    client.removeMessageHandler(action);
  });
};
