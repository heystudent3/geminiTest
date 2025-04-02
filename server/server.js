const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();

// Serve static files from the 'client' directory (for development)
app.use(express.static(path.join(__dirname, '../client')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Import placeholder game modules
const GameEngine = require('../game/engine'); // Adjust path
// const World = require('../game/world');
// const Player = require('../game/player');
// const Items = require('../game/items');
// const Combat = require('../game/combat');

// TODO: Initialize Game Engine instance

// No global player state - state will be attached to each connection

// Function to handle commands when the player is in the 'playing' state
function handlePlayingCommand(ws, commandParts) {
    const command = commandParts[0].toLowerCase();
    let response = "";

    if (command === "quit") {
        // Special command handled directly by server for state change
        ws.gameState = 'menu';
        // No need to remove player state here, could rejoin
        response = "Returning to main menu.\nType 'start' to begin.";
    } else {
        // Pass other commands to the game engine
        response = GameEngine.processCommand(ws, commandParts);
    }

    ws.send(response);
}

// Function to handle commands when the player is in the 'menu' state
function handleMenuCommand(ws, commandParts) {
    const command = commandParts[0].toLowerCase();
    let response = "";

    if (command === "start") {
        ws.gameState = 'playing';
        // Initialize player using the Game Engine
        const player = GameEngine.initializePlayer(ws, "Player"); // Use default name for now
        ws.playerState = player; // Store player object from engine
        // Get initial look response from engine
        response = "Starting game...\n" + GameEngine.processCommand(ws, ["look"]);
    } else if (command === "help") {
        response = "Main Menu:\n - Type 'start' to begin the adventure.\n - Type 'help' to see this menu.";
    } else {
        response = `Unknown menu command: '${command}'. Type 'start' or 'help'.`;
    }
    ws.send(response);
}


wss.on('connection', ws => {
    console.log('Client connected');

    // Initialize state for this connection
    ws.gameState = 'menu'; // Start in the menu
    ws.playerState = null; // No player state until game starts

    // Send welcome message and menu prompt
    ws.send("Welcome to Text Quest RPG!\nType 'start' to begin or 'help' for commands.");

    // Handle messages from this client
    ws.on('message', message => {
        const messageString = message.toString().trim();
        console.log(`Received message (${ws.gameState}): ${messageString}`);
        const commandParts = messageString.split(" ");

        if (commandParts.length > 0 && commandParts[0] !== "") {
            if (ws.gameState === 'menu') {
                handleMenuCommand(ws, commandParts);
            } else if (ws.gameState === 'playing') {
                handlePlayingCommand(ws, commandParts);
            } else {
                // Should not happen
                console.error(`Unknown gameState: ${ws.gameState}`);
                ws.send("An internal error occurred. Please reconnect.");
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        GameEngine.removePlayer(ws); // Clean up player state on disconnect
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});