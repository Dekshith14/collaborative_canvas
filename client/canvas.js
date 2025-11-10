const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

function fitToWindow() {
  const prev = document.createElement("canvas");
  prev.width = canvas.width;
  prev.height = canvas.height;
  prev.getContext("2d").drawImage(canvas, 0, 0);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.drawImage(prev, 0, 0);
}
fitToWindow();
window.addEventListener("resize", fitToWindow);

let isDrawing = false;
let currentStroke = null;

function createStroke(color, size, userId) {
  return {
    strokeId: `${userId}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    points: [],
    color,
    size,
    userId,
  };
}

function drawPoint(point, stroke) {
  if (!point) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  const p = point;
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + 0.1, p.y + 0.1);
  ctx.stroke();
}

function drawStroke(stroke) {
  if (!stroke || stroke.points.length === 0) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.beginPath();
  const pts = stroke.points;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
}

function redrawFromHistory(history) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of history) {
    drawStroke(s);
  }
}
