import { Server as SocketIOServer } from "socket.io";

export const userSocketMap: Record<string, string> = {}; 
const onlineUsers: Record<string, { id: string; name: string }> = {}; 

export function initializeSocket(io: SocketIOServer) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId as string;
    const userName = socket.handshake.auth.userName as string;

    if (userId && userName) {
      userSocketMap[userId.toString()] = socket.id;
      onlineUsers[userId.toString()] = { id: userId, name: userName };

      io.emit("getOnlineUsers", Object.values(onlineUsers));
    }

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        delete onlineUsers[userId];
      }
      io.emit("getOnlineUsers", Object.values(onlineUsers));
    });
  });
}
