// require("./db/mongoose");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const morgan = require("morgan");

// Import Routes
//

// App-express
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static("public"));
// const router = express.Router();

// Middlewares

app.use(express.json());
app.use(morgan("dev"));

// Router Middlewares
app.use("/static", express.static("public"));

// Emit events socket-io library
// (socket.emit) send data only an specific connection
// socket.emit("countUpdated", count);

// Socket-io events
io.on("connection", (socket) => {
  console.log("new web socket connection");
  // listen event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Emit events
  const message = "Welcome!";
  io.emit("message", message);
});

// App Listen
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`app is listen on port number: ${port}`);
});
