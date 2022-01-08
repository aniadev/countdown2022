// import mongo schema
const Messages = require("../../Models/Messenger");
const { multipleMongooseToObject } = require("./mongooseObj");
const { uuid } = require("uuidv4");
const loichuc = [
  {
    userId: uuid(),
    name: "Chủ tịch nước Nguyễn Xuân Phúc",
    msg: "Chúc mừng năm mới xuân Ất Dậu. Chúc các cháu 1 năm mới ấm no hạnh phúc, mạnh khỏe, thành công.",
  },
  {
    userId: uuid(),
    name: "Tổng bí thư Nguyễn Phú Trọng",
    msg: "Chúc mừng năm mới. Sang năm mới chúc toàn thể đồng bào mạnh khỏe, ấm no, gặp nhiều may mắn. Chúc đất nước ta ngày càng giàu mạnh.",
  },
  {
    userId: uuid(),
    name: "President of the United States - Joe Biden",
    msg: "Happy Lunar New Year. Chuc mung nam moi. Dang Cong San Viet Nam muon nam. Ho Chi Minh muon nam",
  },
  {
    userId: uuid(),
    name: "President of the Nga - Vladimir Putin",
    msg: "С новым годом. В новом году желаю всему Вьетнаму здоровья, счастья и удачи. Чтобы страна была богаче и сильнее.",
  },
  {
    userId: uuid(),
    name: "Tổng Bí thư Đảng Cộng sản Trung Quốc - Tap Can Binh",
    msg: "新年快乐。在新的一年里，我祝愿所有越南人民身体健康，幸福快乐，万事如意。让国家更富强。",
  },
  {
    userId: uuid(),
    name: "Kishida Fumio - Japan",
    msg: "あけましておめでとう。新年のご多幸をお祈り申し上げます。ベトナムがより豊かで強くなることを願っています。",
  },
  {
    userId: uuid(),
    name: "Kim Boo-kyum - Korea",
    msg: "새해 복 많이 받으세요. 새해 복 많이 받으세요. 베트남이 더 부유해지고 강해지기를 바랍니다.",
  },
  {
    userId: uuid(),
    name: "Thủ tướng chính phủ - Phạm Minh Chính",
    msg: "Chúc mừng năm mới toàn thể đồng bào cả nước. Vào thời khắc giao thừa thiêng liêng và đầy cảm xúc này, tôi xin được thay mặt lãnh đạo Đảng và Nhà nước, thân ái gửi tới toàn thể đồng bào, đồng chí và chiến sĩ cả nước, cộng đồng người Việt Nam ta ở nước ngoài những tình cảm thân thiết, lời thăm hỏi chân tình và lời chúc mừng năm mới tốt đẹp nhất.",
  },
];
function guiLoiChuc(io) {
  loichuc.map((item, index) => {
    console.log("sendMessage");
    return setTimeout(() => {
      let newMessage = new Messages(item);
      // console.log(item);
      newMessage
        .save()
        .then((result) => {
          // console.log(result);
          io.emit("message", JSON.stringify(result)); // tra ve kem them msgId
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000 * index);
  });
}

// socketio handler
socketIO = (server) => {
  const io = require("socket.io")(server);
  var hpnyTimeout = setInterval(() => {
    var deadline = new Date("feb 1, 2022 00:00:00");
    var currentTime = new Date().getTime();
    var t = deadline - currentTime;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    if (t <= 0) {
      guiLoiChuc(io);
      clearInterval(hpnyTimeout);
    }
    let timeObj = {
      days,
      hours,
      minutes,
      seconds,
    };
    // io.emit("test", JSON.stringify(timeObj));
  }, 1000);

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
