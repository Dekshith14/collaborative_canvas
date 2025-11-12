let colorPicker = document.getElementById("colorPicker");
let strokeInput = document.getElementById("strokeWidth");
let undoBtn = document.getElementById("undoBtn");
let clearBtn = document.getElementById("clearBtn");
let eraserBtn = document.getElementById("eraserBtn");
let brushBtn = document.getElementById("brushBtn");

let brushColor = colorPicker.value || "#000000";
let brushSize = parseInt(strokeInput.value || "3", 10);
let isErasing = false;

colorPicker.addEventListener("change", (e) => (brushColor = e.target.value));
strokeInput.addEventListener("input", (e) => (brushSize = parseInt(e.target.value, 10)));

undoBtn.addEventListener("click", () => socket.emit("undo"));
clearBtn.addEventListener("click", () => socket.emit("clear"));

eraserBtn.addEventListener("click", () => {
  isErasing = true;
  eraserBtn.style.background = "#ff7070";
  brushBtn.style.background = "";
});

brushBtn.addEventListener("click", () => {
  isErasing = false;
  brushBtn.style.background = "#90ee90";
  eraserBtn.style.background = "";
});

// pointer events for drawing
canvas.addEventListener("pointerdown", (e) => {
  isDrawing = true;
  currentStroke = createStroke(brushColor, brushSize, socket.id || "local");
  const rect = canvas.getBoundingClientRect();
  currentStroke.points.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  drawPoint(currentStroke.points[0], currentStroke);
});

canvas.addEventListener("pointermove", (e) => {
  if (!isDrawing || !currentStroke) return;
  const rect = canvas.getBoundingClientRect();
  const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  currentStroke.points.push(p);

  const lastIndex = currentStroke.points.length - 1;
  const prev = currentStroke.points[lastIndex - 1];
  if (!prev) return;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = currentStroke.size;

  if (isErasing) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = currentStroke.color;
  }

  // 🌀 Bézier curve smoothing
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  const midX = (prev.x + p.x) / 2;
  const midY = (prev.y + p.y) / 2;
  ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  ctx.stroke();

  if (socket && socket.connected) {
    socket.emit("cursorMove", { x: e.clientX, y: e.clientY, color: brushColor });
  }
});

function finishStroke() {
  if (!currentStroke) return;
  serverHistory.push(currentStroke);
  sendStrokeToServer(currentStroke);
  currentStroke = null;
  isDrawing = false;
}

canvas.addEventListener("pointerup", finishStroke);
canvas.addEventListener("pointerleave", finishStroke);
