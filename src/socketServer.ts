import { Server } from "socket.io";
import http from "http";
const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", (message, room) => {
    console.log(message, room);
    
    socket.to(room).emit("new_request", message);
  });
});

io.listen(3000);
