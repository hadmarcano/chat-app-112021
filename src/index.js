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
const {addUser, removeUser, getUser,getUsersInRoom} = require("./utils/users");

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

  socket.on("join", (options, callback) => {

    const {error,user} = addUser({id:socket.id, ...options});

    if(error){
      return callback(error);
    }
    


    socket.join(user.room);
    
    // Emit events
    //io.to.emit, socket.broadcast.to.emit
    socket.emit("message", generateMessage("Welcome!","Admin"));
    socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined!`,"Admin"));
    io.to(user.room).emit('roomData',{
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback()

  });

  socket.on("disconnect", () => {

    const user = removeUser(socket.id);
    
    if(user){
      io.to(user.room).emit("message", generateMessage(`${user.username} has left!`,"Admin"));
      io.to(user.room).emit('roomData',{
        room: user.room,
        users:getUsersInRoom(user.room)
      })
    }
  });


  socket.on("sendMessage", (message, callback) => {
    const verifying = new Filter();
    const user = getUser(socket.id);
    // console.log("Hola",user);


    if (verifying.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", generateMessage(message,user.username));
    // Event Acknowledgement
    callback();
  });

  socket.on("sendLocation", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("locationMessage", generateLocationMessage(user.username,message));
    callback();
  });
});

// App Listen
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`app is listen on port number: ${port}`);
});
