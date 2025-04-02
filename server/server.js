const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();

// Serve static files from the 'client' directory (for development)
app.use(express.static(path.join(__dirname, '../client')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('Client connected');

    ws.send('Welcome to Pixel Quest Online Server!');

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        ws.send(`Server received: ${message}`); // Echo back
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});