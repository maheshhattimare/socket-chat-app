import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      // "http://localhost:5173",
      "https://realtime-chat-app.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const ROOM = "group";
io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);

  socket.on("JoinRoom", async (userName) => {
    // console.log(`${userName} is joining the room`);

    await socket.join(ROOM);

    // sent to all
    io.to(ROOM).emit("roomNotice", userName);
    // broadcast
    socket.to(ROOM).emit("roomNotice", userName);
  });

  //   msg key
  socket.on("chatMessage", (msg) => {
    socket.to(ROOM).emit("chatMessage", msg);
  });

  //   typing...
  socket.on("typing", (userName) => {
    socket.to(ROOM).emit("typing", userName);
  });

  //  stop typing...
  socket.on("stopTyping", (userName) => {
    socket.to(ROOM).emit("stopTyping", userName);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
