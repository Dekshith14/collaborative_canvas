import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let drawHistory = [];
let users = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  users[socket.id] = { color: getRandomColor(), id: socket.id };

  socket.emit("init", { drawHistory, users });

  socket.on("draw", (data) => {
    drawHistory.push(data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("undo", () => {
    drawHistory.pop();
    io.emit("redraw", drawHistory);
  });

  socket.on("clear", () => {
    drawHistory = [];
    io.emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("userLeft", socket.id);
  });
});

function getRandomColor() {
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c"];
  return colors[Math.floor(Math.random() * colors.length)];
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
