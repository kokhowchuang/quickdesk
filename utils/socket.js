const { getUsers, users } = require("./getUsers");
var counter = 0;
var current = 0;

//Socket connection
function socket(io) {
  io.on("connection", (socket) => {
    socket.on("joined-user", (data) => {
      //Storing users connected in a room in memory
      var user = {};
      user[socket.id] = {
        username: data.username,
        offline: false,
        serving: "0",
      };

      if (users[data.roomname]) {
        users[data.roomname].push(user);
      } else {
        users[data.roomname] = [user];
      }

      //Joining the Socket Room
      socket.join(data.roomname);

      //Emitting New Username to Clients
      io.to(data.roomname).emit("joined-user", {
        username: data.username,
      });

      //Send online users array
      io.to(data.roomname).emit("online-users", getUsers(users[data.roomname]));

      io.emit("show-current", current);
      io.emit("show-number", counter);
    });

    //Emitting messages to Clients
    socket.on("chat", (data) => {
      io.to(data.roomname).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    //Broadcasting the user who is typing
    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomname).emit("typing", data.username);
    });

    //Remove user from memory when they disconnect
    socket.on("disconnecting", () => {
      var rooms = Object.keys(socket.rooms);
      var socketId = rooms[0];
      var roomname = rooms[1];

      if (users[roomname] && users[roomname].length) {
        users[roomname].forEach((user, index) => {
          if (user[socketId]) {
            users[roomname].splice(index, 1);
          }
        });
      }

      //Send online users array
      io.to(roomname).emit("online-users", getUsers(users[roomname]));
    });

    //Broadcasting the user who is typing
    socket.on("operate", (data) => {
      var rooms = Object.keys(socket.rooms);
      var socketId = rooms[0];
      var roomname = rooms[1];

      users[roomname].forEach((item) => {
        if (item[socketId]) {
          item[socketId]["offline"] = !item[socketId]["offline"];
        }
      });

      //Send online users array
      io.to(roomname).emit("online-users", getUsers(users[roomname]));
    });

    socket.on("complete", (data) => {
      var rooms = Object.keys(socket.rooms);
      var socketId = rooms[0];
      var roomname = rooms[1];

      users[roomname].forEach((item) => {
        if (item[socketId]) {
          item[socketId]["offline"] = true;
        }
      });

      console.log(users[roomname]);

      //Send online users array
      io.to(roomname).emit("online-users", getUsers(users[roomname]));
    });

    socket.on("call", (data) => {
      if (counter > current) {
        current += 1;
        io.emit("show-current", current);

        var rooms = Object.keys(socket.rooms);
        var socketId = rooms[0];
        var roomname = rooms[1];

        users[roomname].forEach((item) => {
          if (item[socketId]) {
            item[socketId]["serving"] = String(current);
            item[socketId]["offline"] = false;
          }
        });

        //Send online users array
        io.to(roomname).emit("online-users", getUsers(users[roomname]));
      }
    });

    socket.on("take-number", () => {
      counter += 1;
      io.emit("show-number", counter);
    });
  });
}

module.exports = socket;
