import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Create a new express application instance
const app: express.Application = express();

app.use(bodyParser.json());
app.use(cookieParser());

import AuthRoute from "./app/routes/AuthRoute";
app.use("/api", AuthRoute)

// Create a new http server instance
const httpServer = createServer(app);

// Create a new socket.io server instance
const io = new Server(httpServer);

declare module "socket.io" {
  export interface Socket {
    userId?: string;
  }
}

// Middleware for authentication
io.use((socket, next) => {
  console.log("middleware");
  const token = socket.handshake.query.token as string;
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err);
      return next(new Error("Authentication error"));
    }
    if (typeof decoded === "object" && decoded !== null) {
      socket.userId = decoded.id;
    }
    next();
  });
});

// Listen for connection events from clients
io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.userId}`);

  // Listen for custom event from clients
  socket.on("send-message", (data) => {
    console.log(`message from user ${socket.userId}: ${data.data.message}`);

    // Emit the message to all connected clients
    io.emit("receive-message", data);
  });

  // Listen for disconnect event
  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.userId}`);
  });
});

// Start the http server listening for requests
httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
