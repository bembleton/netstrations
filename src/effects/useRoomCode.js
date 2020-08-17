import { useLocation } from "react-router-dom";

export const useRoomCode = () => {
  const { search } = useLocation();
  const room_code = search.replace(/\?/, '').toUpperCase();
  return room_code;
}