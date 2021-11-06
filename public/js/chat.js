// Initializing Socket-io library
const socket = io();

socket.on("message", (message) => {
  console.log(message);
});
