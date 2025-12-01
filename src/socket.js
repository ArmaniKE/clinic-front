import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

// подключаемся без auth в query — сервер у нас открытый; если нужно, можно передать токен
const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
