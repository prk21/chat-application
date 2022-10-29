// Node server which will handle socke io connection
//import { createServer } from "http";
//import { Server } from "socket.io";

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const express = require("express");
const app = express();
// app.listen(8000, function (req, res) {
//   console.log("Listening on 8000 port");
// });

const io = new Server(8000, {
  cors: {
    origin: "*",
  },
});
// console.log(io);
//const { Server } = require("socket.io");
// const io = new Server(8000);
// console.log(io);
//const io = new Server(httpServer);

//const io1 = require("socket.io")(8000);
const users = {};
//on -> meaning recieveing an event and handling it
//emit -> emiting an event toi handle on other side
// server-> client and client->server

// server-side
// io.on("connection", (socket) => {
//   console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
// });

// // client-side
// socket.on("connect", () => {
//   console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
// });
io.on("connection", (socket) => {
  //console.log(socket.id);
  //console.log("Started");
  // If any new user joins, let others connected to server know
  socket.on("new-user-joined", (name) => {
    console.log(name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  //If someone sends a message, inform everybody
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //If someone leaves, inform everybody
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("leftChat", users[socket.id]);
    delete users[socket.id];
  });
});
