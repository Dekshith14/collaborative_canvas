
let colorPicker = document.getElementById("colorPicker");
let strokeInput = document.getElementById("strokeWidth");
let undoBtn = document.getElementById("undoBtn");
let clearBtn = document.getElementById("clearBtn");

let brushColor = colorPicker.value || "#000000";
let brushSize = parseInt(strokeInput.value || "3", 10);

colorPicker.addEventListener("change", (e) => brushColor = e.target.value);
strokeInput.addEventListener("input", (e) => brushSize = parseInt(e.target.value, 10));

undoBtn.addEventListener("click", () => {
  socket.emit("undo");
});

clearBtn.addEventListener("click", () => {
  socket.emit("clear");
});

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
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = currentStroke.color;
  ctx.lineWidth = currentStroke.size;
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
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
