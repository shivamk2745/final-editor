const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected ", socket.id);

  socket.on("registerSocketId", () => {
    socket.role = "host";
    console.log(`User ${socket.id} is a host`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    const role="client";
    socket.role = role;
    console.log(`User ${socket.id} joined room ${roomId} as ${role}`);
    socket.emit("roleAssigned", { roomId, role });
  });

  socket.on("codeUpdate", ({ roomId, code }) => {
    console.log("Code updated", roomId, code);
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ", socket.id);
  });
});

module.exports = { io, server, app };
