import { useGameContext } from "./gameContext";
import { useSetup, useTeardown } from "./useSanity";

export const useMessage = (action, handler) => {
  const { client } = useGameContext();

  useSetup(() => {
    client.addMessageHandler(action, handler);
  });

  useTeardown(() => {
    client.removeMessageHandler(action);
  });
};
