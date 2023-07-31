const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const PORT = 3250;
const { Server } = require("socket.io");

// cors is because socket.io has a bunch of cors problems which this will resolve
app.use(cors());

// this will use http library, which will generate server
const server = http.createServer(app);

// connection that were gonna establish, what this does is, it takes in an object (cors)
// origin tells us which server is gonna be running
// methods tells us which method is going to be allowed
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//initiate and detect if someone is on this server
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("sendMsg", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SEVER RUNNING");
});

module.exports = app;
