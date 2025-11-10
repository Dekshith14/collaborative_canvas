const socket = io();

let myUserId = null;
let serverHistory = [];

function sendStrokeToServer(stroke) {
  socket.emit("draw", stroke);
}

socket.on("connect", () => {
  myUserId = socket.id;
  console.log("connected as", myUserId);
});

socket.on("init", (payload) => {
  serverHistory = payload.drawHistory || [];
  redrawFromHistory(serverHistory);
  updateUserList(payload.users || {});
});

socket.on("draw", (stroke) => {
  serverHistory.push(stroke);
  drawStroke(stroke);
});

socket.on("redraw", (history) => {
  serverHistory = history;
  redrawFromHistory(serverHistory);
});

socket.on("clear", () => {
  serverHistory = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on("userLeft", (id) => {
  console.log("user left:", id);
});

function updateUserList(usersObj) {
  const el = document.getElementById("userList");
  const ids = Object.keys(usersObj || {});
  el.textContent = `Users: ${ids.length}`;
}
