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
        const command = message.toString().trim(); // Convert message to string and trim whitespace
        let response = "";

        switch (command) {
            case "look":
                response = "You are standing in a forest. There is a path to the north and a dark cave to the east.";
                break;
            case "north":
                response = "You follow the path north. It leads to a small village.";
                break;
            case "east":
                response = "You enter the dark cave. It is damp and you can hear water dripping.";
                break;
            default:
                response = `Unknown command: ${command}. Try 'look', 'north', or 'east'.`;
        }

        ws.send(response);
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