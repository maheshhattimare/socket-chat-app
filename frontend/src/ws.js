// ws - web socket
import { io } from "socket.io-client";

export function connectWS() {
  return io("https://socket-chat-app-backend-pg1r.onrender.com");
}
