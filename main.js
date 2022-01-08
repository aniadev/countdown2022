//=============================================================================
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const io_port = 8080;
const database = require("./config/db");
database.connect();
var http = require("http");
const server = http.createServer(app);
const Messages = require("./Models/Messenger");

app.use(cors());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("/msg", (req, res) => {
  let _page = req.query._p || 0;
  Messages.find()
    .sort({ _id: -1 })
    .skip(_page * 10)
    .limit(10)
    .exec((err, result) => {
      if (err || !result) {
        res.json({
          success: true,
          message: "API get all message ERROR",
          page: _page,
          query: null,
        });
      }
      res.json({
        success: true,
        message: "API get all message",
        page: _page,
        query: result,
      });
    });
});
app.get("/name/:id", (req, res) => {
  Messages.findOne({ userId: req.params.id })
    .sort({ _id: -1 })
    .exec((err, result) => {
      if (result) {
        res.json({
          success: true,
          message: "Get name",
          id: req.params.id,
          name: result.name,
        });
      } else {
        res.json({
          success: false,
          message: "Get name",
          id: req.params.id,
          name: null,
        });
      }
    });
});
// import socketIO
const socketio = require("./src/util/socketIO");
socketio(server);

server.listen(process.env.PORT || io_port, () =>
  console.log(`Socket listening on port ${process.env.PORT || io_port}!`)
);
