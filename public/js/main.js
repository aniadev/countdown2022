// const SERVER_URI = "http://localhost:8080";
const SERVER_URI = "https://xinchao2022.herokuapp.com";
var msgPage = 1;
var msgPending = true;
var fireworkLimit = 2;
var fireworkCounter = 0;
// Firework handler
import { happynewyear } from "./firework.min.js";

// Countdown display
var deadline = new Date("feb 1, 2022 00:00:00").getTime();
// var deadline = new Date(Date.now() + 6000).getTime();
var x = setInterval(function () {
  var currentTime = new Date().getTime();
  var t = deadline - currentTime;
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((t % (1000 * 60)) / 1000);
  document.getElementById("day").innerHTML = days < 10 ? `0${days}` : `${days}`;
  document.getElementById("hour").innerHTML =
    hours < 10 ? `0${hours}` : `${hours}`;
  document.getElementById("minute").innerHTML =
    minutes < 10 ? `0${minutes}` : `${minutes}`;
  document.getElementById("second").innerHTML =
    seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (t <= 0) {
    clearInterval(x);
    document.getElementById("time-up").innerHTML =
      "🎉🧨🎆🎉 CHÚC MỪNG NĂM MỚI 🧨🎊🎋🎇";
    document.getElementById("day").innerHTML = "00";
    document.getElementById("hour").innerHTML = "00";
    document.getElementById("minute").innerHTML = "00";
    document.getElementById("second").innerHTML = "00";
    happynewyear();
    fireworkLimit = 20;
  }
}, 1000);

// Randomize nick name
var firstNameList = [
  "Mèo",
  "Chuột",
  "Cún",
  "Heo",
  "Cá",
  "Gà",
  "Nhím",
  "Sóc",
  "Thỏ",
  "Yasuo",
];
var lastNameList = [
  "Xanh",
  "Đen",
  "Nâu",
  "Hồng",
  "Vàng",
  "Ngu",
  "Xinh",
  "Vui Vẻ",
  "Nướng",
  "Vị Chanh",
];

function getRandomName() {
  return (
    firstNameList[Math.floor(Math.random() * firstNameList.length)] +
    " " +
    lastNameList[Math.floor(Math.random() * lastNameList.length)]
  );
}
var nickNameForm = document.getElementById("client-name");
nickNameForm.value = getRandomName();

// update new message
function addNewMessageToChatbox(
  _msgId,
  _userId,
  _nickname,
  _newMessage,
  _imgLink,
  _time
) {
  //;
  let elData = { _msgId, _userId, _nickname, _newMessage, _imgLink, _time };
  let msgElement = createMsgElement(elData);
  document.getElementById("all-msg").append(htmlToElement(msgElement));
  setFocusOnDivWithId(_msgId);
}
function addOlderMessage(
  _msgId,
  _userId,
  _nickname,
  _newMessage,
  _imgLink,
  _time
) {
  let elData = { _msgId, _userId, _nickname, _newMessage, _imgLink, _time };
  let msgElement = createMsgElement(elData);
  document
    .getElementById("all-msg")
    .insertBefore(
      htmlToElement(msgElement),
      document.getElementById("all-msg").firstChild
    );
}
function createMsgElement(elData) {
  const { _msgId, _userId, _nickname, _newMessage, _imgLink, _time } = {
    ...elData,
  };
  let owner = false;
  if (_userId === getCookie("id")) {
    owner = true;
  }
  let msgElement = `
  <li id="${_msgId}" class="msg-item ${owner ? "owner" : ""}">
      <span class="msg-name">
      ${_nickname} <span style="font-family: Sans-serif; font-weight: 300; font-size:12px; color:#b2bec3;">
      ${renderTime(_time)} </span> 
  </span>
    <span class="msg-text">${_newMessage}</span>
    ${
      _imgLink
        ? `<div>
            <img src="" alt="img">
           </div>`
        : ""
    }
</li>
  `;
  return msgElement;
}
function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
// Focus message function
var autoScroll = false;
function setFocusOnDivWithId(elementId) {
  const scrollIntoViewOptions = { behavior: "smooth", block: "center" };
  document.getElementById(elementId).scrollIntoView(scrollIntoViewOptions);
}
function renderTime(_time) {
  //  return Jan 01 12:32
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = MONTHS[_time.getMonth()];
  let date = _time.getDate();
  let hours = _time.getHours();
  let minutes = _time.getMinutes();
  return `${month} ${date < 10 ? "0" + date : date} ${
    hours < 10 ? "0" + hours : hours
  }:${minutes < 10 ? "0" + minutes : minutes}`;
}

// Messenger
var msgForm = document.getElementById("chatbox-form");
var msg = document.getElementById("message");
msg.focus();
msgForm.addEventListener("submit", (e) => {
  const messageData = new FormData(e.target);
  e.preventDefault();
  let messageText = messageData.get("message");
  if (messageText) {
    sendMessage(messageText);
  }
  msg.value = ""; // clear message input
  msg.focus();
});

// load older message
async function getMessage(_page) {
  const response = await fetch("/msg?_p=" + _page, {
    method: "get",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
getMessage(0)
  .then((response) => {
    if (response.success === true) {
      const oldMsg = response.query;
      // console.log(oldMsg);
      oldMsg.map((msg) => {
        addOlderMessage(
          msg._id,
          msg.userId,
          msg.name,
          msg.msg,
          msg.imgLink,
          new Date(msg.time)
        );
      });
      setFocusOnDivWithId(oldMsg[0]._id);
      msgPending = false;
    }
  })
  .catch((err) => {
    console.log(err);
  });
function sendMessage(messageText) {
  let userName = document.getElementById("client-name").value;
  let data = {
    userId: getCookie("id"),
    name: userName || getRandomName(),
    msg: messageText,
  };
  socket.emit("message", JSON.stringify(data));
}
// check msg viewport for get older messages
function isInViewport(childEl, parentEl) {
  const childRect = childEl.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();
  return (
    childRect.top >= parentRect.top &&
    childRect.left >= parentRect.left &&
    childRect.bottom <= parentRect.bottom &&
    childRect.right <= parentRect.right
  );
}
document.getElementById("all-msg").addEventListener("scroll", scrollListener);
function scrollListener() {
  let isLastestMsgView = isInViewport(
    document.getElementById("all-msg").firstChild,
    document.getElementById("all-msg")
  );
  if (isLastestMsgView && !msgPending) {
    msgPending = true;
    getMessage(msgPage)
      .then((response) => {
        if (response.success === true) {
          const oldMsg = response.query;
          // console.log(oldMsg);
          oldMsg.map((msg) => {
            addOlderMessage(
              msg._id,
              msg.userId,
              msg.name,
              msg.msg,
              msg.imgLink,
              new Date(msg.time)
            );
          });
          // setFocusOnDivWithId(oldMsg[0]._id);
          let currentPage = parseInt(response.page);
          msgPage = currentPage + 1;
          msgPending = false;
          // console.log(`Page: ${msgPage}, Pending: ${msgPending}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
// generate id
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
if (!document.cookie) {
  document.cookie = `id=${uuidv4()}`;
}
function getUsername() {
  return document.getElementById("client-name").value || getRandomName();
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// socketIO
var socket = io(SERVER_URI);
socket.on("connect", () => {
  // either with send()
  socket.emit("status", `${getCookie("id")} connected`);
});
socket.on("online", (data) => {
  document.getElementById("online-counter").innerHTML = JSON.parse(data).count;
});
socket.on("message", (newMsg) => {
  let msgObj = JSON.parse(newMsg);
  addNewMessageToChatbox(
    msgObj._id,
    msgObj.userId,
    msgObj.name,
    msgObj.msg,
    msgObj.imgLink,
    new Date(msgObj.time)
  );
});
socket.on("fireworks", (data) => {
  let fireworkData = JSON.parse(data);
  if (fireworkData.userId !== getCookie("id")) {
    fireworksPowered();
  }
  addNewMessageToChatbox(
    uuidv4(),
    fireworkData.userId,
    fireworkData.name,
    `Vừa bắn 1 quả pháo hoa`,
    null,
    new Date(Date.now())
  );
  // console.log(fireworkData);
});
document.getElementById("fireworks-btn").addEventListener("click", () => {
  fireworksPowered();
  let fireworkData = {
    userId: getCookie("id"),
    name: getUsername(),
  };
  socket.emit("fireworks", JSON.stringify(fireworkData));
  if (fireworkCounter > fireworkLimit) {
    fireworkCounter = 0;
    document.getElementById("fireworks-btn").disabled = true;
    document.getElementById("fireworks-btn").innerText = "Bắn chậm thôi !";
    setTimeout(() => {
      document.getElementById("fireworks-btn").disabled = false;
      document.getElementById("fireworks-btn").innerText = "Bắn 1 quả pháo 🧨";
    }, 5000);
  } else {
    fireworkCounter++;
  }
});
