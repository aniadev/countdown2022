// import mongo schema
const Messages = require("../../Models/Messenger");
const { multipleMongooseToObject } = require("./mongooseObj");

// socketio handler
socketIO = (server) => {
  const io = require("socket.io")(server);
  io.on("connect", (socket) => {
    socket.on("message", (data) => {
      // console.log("🚀 ~ file: socketIO.js ~ line 5 ~ socket.on ~ data", data);
      let dataObj = JSON.parse(data);
      let newMessage = new Messages(dataObj);
      // console.log(dataObj);
      newMessage
        .save()
        .then((result) => {
          // console.log(result);
          io.emit("message", JSON.stringify(result)); // tra ve kem them msgId
        })
        .catch((err) => {
          console.log(err);
        });
    });
    socket.on("status", () => {
      let count = { count: io.engine.clientsCount };
      io.emit("online", JSON.stringify(count));
    });
    socket.on("disconnect", () => {
      let count = { count: io.engine.clientsCount };
      io.emit("online", JSON.stringify(count));
    });
    socket.on("fireworks", (data) => {
      io.emit("fireworks", data);
    });
  });
};

module.exports = socketIO;
