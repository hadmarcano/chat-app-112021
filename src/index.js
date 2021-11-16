// require("./db/mongoose");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const Filter = require("bad-words");
const express = require("express");
const morgan = require("morgan");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

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
// (io.emit) send data to every people connected.
// (socket.emit) send data only an specific connection
// (socket.broadcast.emit) send data to all people connected except me.
// socket.emit("countUpdated", count);

// Socket-io events
io.on("connection", (socket) => {
  console.log("new web socket connection");
  // listen event

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    
    // Emit events
    //io.to.emit, socket.broadcast.to.emit
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined!`));

  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
    io.emit("message", generateMessage("An user has left!"));
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.emit("message", generateMessage(message));
    // Event Acknowledgement
    callback();
  });

  socket.on("sendLocation", (message, callback) => {
    io.emit("locationMessage", generateLocationMessage(message));
    callback();
  });
});

// App Listen
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`app is listen on port number: ${port}`);
});
