const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity, restrict in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", ({ roomId, userName, isHost }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        participants: [],
        code: "",
        language: "javascript",
        input: "",
        currentProblem: null,
      };
    }
    rooms[roomId].participants.push({ id: socket.id, name: userName, isHost });

    // Emit updated room users
    io.to(roomId).emit("room-users", rooms[roomId].participants);

    // Send existing code and problem to the newly joined user
    socket.emit("code-change", rooms[roomId].code);
    socket.emit("language-change", rooms[roomId].language);
    socket.emit("input-change", rooms[roomId].input);
    socket.emit("problem-selected", rooms[roomId].currentProblem);
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].code = code;
      socket.to(roomId).emit("code-change", code);
    }
  });

  socket.on("language-change", ({ roomId, language }) => {
    if (rooms[roomId]) {
      rooms[roomId].language = language;
      socket.to(roomId).emit("language-change", language);
    }
  });

  socket.on("input-change", ({ roomId, input }) => {
    if (rooms[roomId]) {
      rooms[roomId].input = input;
      socket.to(roomId).emit("input-change", input);
    }
  });

  socket.on("chat-message", ({ roomId, message }) => {
    io.to(roomId).emit("chat-message", message);
  });

  socket.on("problem-selected", ({ roomId, problem }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentProblem = problem;
      io.to(roomId).emit("problem-selected", problem);
    }
  });

  socket.on("run-code", ({ roomId, code, language, input }) => {
    const runCode = (code, input, language) => {
      // Add code execution logic here
      // For simplicity, we'll handle only JavaScript in this example
      if (language === "javascript") {
        return new Promise((resolve, reject) => {
          exec(`node -e "${code}"`, (error, stdout, stderr) => {
            if (error) {
              reject(stderr);
            } else {
              resolve(stdout);
            }
          });
        });
      } else {
        return Promise.reject("Language not supported");
      }
    };

    runCode(code, input, language)
      .then((output) => {
        io.to(roomId).emit("output-result", output);
      })
      .catch((error) => {
        io.to(roomId).emit("output-result", error);
      });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    for (let roomId in rooms) {
      const room = rooms[roomId];
      room.participants = room.participants.filter((p) => p.id !== socket.id);
      io.to(roomId).emit("room-users", room.participants);

      if (room.participants.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = { server, io, app };
