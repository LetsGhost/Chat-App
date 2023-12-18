import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Create a new express application instance
const app: express.Application = express();

// Create a new http server instance
const httpServer = createServer(app);

// Create a new socket.io server instance
const io = new Server(httpServer);

// Listen for connection events from clients
io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for custom event from clients
    socket.on('my event', (data) => {
        console.log(data);
    });

    // Listen for disconnect event
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the http server listening for requests
httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});