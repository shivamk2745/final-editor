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
  console.log("New client connected", socket.id);

  socket.on("join-room", ({ roomId, userName, isHost }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        participants: [],
        code: "",
        language: "javascript",
        input: "",
        currentProblem: null,
        videoParticipants: [],
      };
    }
    rooms[roomId].participants.push({ id: socket.id, name: userName, isHost });

    // Emit updated room users
    io.to(roomId).emit("room-users", rooms[roomId].participants);

    // Send existing code and problem to the newly joined user
    socket.emit("code-change", rooms[roomId].code);
    socket.emit("language-change", rooms[roomId].language);
    socket.emit("input-change", rooms[roomId].input);
    if (rooms[roomId].currentProblem) {
      socket.emit("problem-selected", rooms[roomId].currentProblem);
    }
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

  // Video Call Events
  socket.on("video-ready", ({ roomId, userName, peerId }) => {
    if (rooms[roomId]) {
      // Add user to video participants with their peer ID
      rooms[roomId].videoParticipants.push({
        id: socket.id,
        name: userName,
        peerId: peerId,
      });

      // Notify other users in room that a new user is ready for video
      socket.to(roomId).emit("user-joined-video", {
        userId: socket.id,
        userName,
        peerId,
      });
    }
  });

  socket.on(
    "call-user",
    ({ userToSignal, callerId, signal, roomId, callerName }) => {
      io.to(userToSignal).emit("receiving-call", {
        signal,
        callerId,
        callerName,
      });
    }
  );

  socket.on("accept-call", ({ signal, to, roomId }) => {
    io.to(to).emit("call-accepted", {
      signal,
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);

    // Find which rooms this user was in
    Object.keys(rooms).forEach((roomId) => {
      const room = rooms[roomId];

      // Remove from participants
      const participantIndex = room.participants.findIndex(
        (p) => p.id === socket.id
      );
      if (participantIndex !== -1) {
        room.participants.splice(participantIndex, 1);
        io.to(roomId).emit("room-users", room.participants);
      }

      // Find user in video participants to get their peerId
      const videoParticipant = room.videoParticipants?.find(
        (p) => p.id === socket.id
      );
      const peerId = videoParticipant?.peerId;

      // Remove from video participants
      const videoParticipantIndex = room.videoParticipants?.findIndex(
        (p) => p.id === socket.id
      );
      if (videoParticipantIndex !== -1) {
        room.videoParticipants.splice(videoParticipantIndex, 1);
        io.to(roomId).emit("user-left-video", { userId: socket.id, peerId });
      }

      // Clean up empty rooms
      if (room.participants.length === 0) {
        delete rooms[roomId];
      }
    });
  });
});

module.exports = { app, server, io };
