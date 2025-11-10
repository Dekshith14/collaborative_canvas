---

Real-Time Collaborative Canvas

A real-time multi-user drawing application built using Vanilla JavaScript, HTML5 Canvas, Node.js, and Socket.io.
Multiple users can draw simultaneously on the same shared canvas with instant synchronization, global undo/redo, and user tracking.

---

Features

* Real-time Collaboration
  All connected users see drawings as they happen without refreshing.

* Drawing Tools
  Brush tool with adjustable color and stroke width.
  Undo removes the last stroke globally.
  Clear clears the entire canvas for everyone.

* User System
  Each user is assigned a random color upon connection.
  User count updates dynamically in the toolbar.

* Shared Canvas State
  All users’ strokes are stored in a shared global state.
  Undo and Clear actions re-render the canvas for everyone consistently.

* Lightweight and Fast
  Built entirely with native Canvas and WebSocket APIs.
  Optimized stroke batching and redraw logic.

---

Tech Stack

Frontend: Vanilla JavaScript, HTML5 Canvas, CSS
Backend: Node.js, Express, Socket.io
Real-time Transport: WebSockets (via Socket.io)
Architecture: Event-based drawing synchronization

---

Setup Instructions

1. Clone the repository
   git clone [https://github.com/](https://github.com/)<your-username>/collaborative_canvas.git
   cd collaborative-canvas

2. Install dependencies
   npm install

3. Start the server
   npm start

4. Open the app
   Go to [http://localhost:3000](http://localhost:3000) in your browser.

   To test real-time collaboration:

   * Open the same URL in two tabs or browsers.
   * Draw in one tab; it will appear live in the other.

---

Folder Structure

collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── websocket.js
│   └── main.js
├── server/
│   └── server.js
├── package.json
├── README.md
└── ARCHITECTURE.md

---

How It Works

1. Each user connects via Socket.io to the server.
2. When a user draws, their stroke (points, color, size, userId) is sent to the server.
3. The server stores the stroke in a shared drawHistory array.
4. The server broadcasts the stroke to all other clients.
5. Undo and Clear actions update the global history and emit redraw or clear events.
---

Known Limitations

* Undo removes the last global stroke (not per-user undo).
* No persistent storage (drawings are lost when the server restarts).
* No live cursor preview.

---

Time Spent

Server setup (Express + Socket.io): 1 hr
Canvas drawing logic: 1.5 hrs
Real-time sync + Undo/Clear: 1 hr
Testing and Debugging: 0.5 hr
Documentation: 0.5 hr
Total: Approximately 4.5 hours
---

Author

Name: Dekshith
Institution: PES University
Year: 2025
Project: Real-Time Collaborative Drawing Canvas
