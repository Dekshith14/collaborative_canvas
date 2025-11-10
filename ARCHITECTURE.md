---

Architecture Documentation — Real-Time Collaborative Canvas

Overview

This document explains the system architecture, event flow, and state synchronization logic behind the Real-Time Collaborative Drawing Canvas.

The project enables multiple users to draw together on a shared HTML5 canvas with instant updates, global undo/redo, and consistent synchronization.

---

System Architecture

Components

Layer | Technology | Responsibility
Client | HTML5 Canvas + JS | Capture drawing actions and render updates
Server | Node.js + Express + Socket.io | Manage WebSocket connections and share state
Network | Socket.io (WebSockets) | Bi-directional, real-time data transfer

---

Data Flow Diagram

User Action (draws on canvas)
↓
Client (canvas.js)
↓ emits "draw" event
Socket.io Client (websocket.js)
↓
Server (server.js)
↓ stores stroke → updates drawHistory
Broadcasts "draw" event
↓
Other Clients (canvas.js)
↓
Render stroke on canvas

---

WebSocket Protocol

Event | Direction | Description
init | server → client | Sends initial state and active users
draw | client ↔ server | Broadcasts a new stroke (batch of points)
undo | client → server | Removes last stroke from global history
redraw | server → client | Sends full updated history after undo
clear | client ↔ server | Clears entire canvas for all users
userLeft | server → client | Removes disconnected users

---

Undo/Redo Strategy

Shared History
The server maintains a global drawHistory[] list of all strokes.

Undo Implementation
When any client emits undo, the last stroke is popped from drawHistory.
The server emits a redraw event with the updated history.

Redraw Process
All clients clear their canvas and re-render the strokes sequentially.

Redo (optional)
Currently not implemented but can be achieved by maintaining an auxiliary redoStack[].

---

Performance Optimizations

Per-stroke batching
Each stroke is sent once (instead of every mousemove event), minimizing bandwidth.

Client-side smoothing
Canvas draws line segments between consecutive points to achieve smooth lines.

Efficient redraws
Redrawing happens only during Undo or Clear actions, not on every event.

Socket.io reliability
Socket.io handles packet delivery and reconnects automatically.

---

Conflict Resolution

Overlapping Strokes
The system uses a simple “latest stroke wins” model.
There’s no merge conflict — new strokes overwrite pixels if overlapping.

Undo Conflict
Global undo affects all users equally, ensuring state consistency.

---

Consistency Guarantees

Every client’s canvas is a replica of the global server-side drawHistory[].
When new users join, they receive the entire existing history (init event).
If a user disconnects, others remain unaffected.

---

Future Enhancements

Feature | Description
Live cursor preview | Show other users’ pointer positions in real time
Per-user undo | Undo only strokes created by that user
Room system | Multiple independent canvases (rooms.js)
Session persistence | Save and load canvas data from disk or database
Touch optimization | Add gesture smoothing for mobile users

---

Summary

The app achieves:
Smooth real-time collaboration via Socket.io
Global state consistency using centralized drawHistory
Lightweight, framework-free canvas operations
Modular, extensible architecture for future scaling

---

Author: Dekshith
Date: November 2025
Version: 1.0.0
Project: Real-Time Collaborative Drawing Canvas

---
