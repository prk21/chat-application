//import { io } from "socket.io-client";
//const io = require("socket.io-client");
// url of server
const socket = io("http://localhost:8000/");
/*, {
  cors: {
    origin: "http://localhost:8000/socket.io/*",
    methods: ["GET", "POST"],
  },
});*/

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var audio = new Audio("/media/notification.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

//Ask new users's name and let server know
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

// If a new user joins receive his name from server and inform others
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//if server sends a message, receieve it and display
socket.on("receive", (data) => {
  append(`${data.name} : ${data.message} `, "left");
});
//if a user leaves the chat, show on screen that the user left
socket.on("leftChat", (name) => {
  append(`${name} left the chat`, "right");
});

// if form gets submitted[ any user sends message] , send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, `right`);
  socket.emit("send", message);
  messageInput.value = "";
});
