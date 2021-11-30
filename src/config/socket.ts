import { io } from "socket.io-client";
import { SOCKET_SERVER, SOCKET_PORT } from "./constants";

const socket = io(`${SOCKET_SERVER}${SOCKET_PORT}`);

export default socket;
