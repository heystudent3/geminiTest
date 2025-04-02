const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();

// Serve static files from the 'client' directory (for development)
app.use(express.static(path.join(__dirname, '../client')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const gameData = require('./game_data');
const locations = gameData.locations;

// No global player state - state will be attached to each connection

// Function to handle commands for a specific player (ws)
function handleCommand(ws, commandParts) {
    const command = commandParts[0];
    const playerState = ws.playerState; // Get state associated with this connection
    let response = "";
    const currentLocationData = locations[playerState.location];

    switch (command) {
        case "look":
            let description = currentLocationData.description;
            // NOTE: Enemy/Item state is currently global in locations data
            if (currentLocationData.enemy) {
                description += ` A ${currentLocationData.enemy} is here.`;
            }
            if (currentLocationData.item && !playerState.inventory.includes(currentLocationData.item)) {
                 // Only mention item if player doesn't have it (basic check)
                 // description += ` You see a ${currentLocationData.item}.`; // Redundant if in main desc
            }
            response = description + ` You have: ${playerState.inventory.join(", ") || 'nothing'}`;
            break;
        case "north":
        case "south":
        case "east":
        case "west":
            if (currentLocationData[command]) {
                playerState.location = currentLocationData[command];
                // Send new location info after moving
                const newLocationData = locations[playerState.location];
                let newDescription = newLocationData.description;
                 if (newLocationData.enemy) {
                    newDescription += ` A ${newLocationData.enemy} is here.`;
                 }
                response = newDescription + ` You have: ${playerState.inventory.join(", ") || 'nothing'}`;
            } else {
                response = `You cannot go ${command} from here.`;
            }
            break;
        case "inventory":
        case "inv": // Alias
            response = `You have: ${playerState.inventory.join(", ") || 'nothing'}`;
            break;
        case "get":
             // NOTE: Item state modification is currently global
            if (currentLocationData.item) {
                const item = currentLocationData.item;
                if (!playerState.inventory.includes(item)) { // Prevent getting multiple times
                    playerState.inventory.push(item);
                    // delete currentLocationData.item; // Deleting globally affects all players
                    response = `You picked up the ${item}. Inventory: ${playerState.inventory.join(", ")}`;
                } else {
                    response = `You already have the ${item}.`;
                }
            } else {
                response = "There is nothing to get here.";
            }
            break;
        case "attack":
            // NOTE: Enemy state modification is currently global
            if (currentLocationData.enemy) {
                const enemy = currentLocationData.enemy;
                // Simple combat: enemy is defeated immediately
                delete currentLocationData.enemy; // Removing globally affects all players
                response = `You attack the ${enemy} with your ${playerState.inventory[0] || 'bare hands'} and defeat it!`;
                 // TODO: Add proper combat logic (HP, damage, etc.)
                 // TODO: Remove enemy from location state properly for multiplayer
            } else {
                response = "There is nothing to attack here.";
            }
            break;
        default:
            response = `Unknown command: '${command}'. Try 'look', 'north', 'south', 'east', 'west', 'inventory', 'get', 'attack'.`;
    }
    ws.send(response);
}


wss.on('connection', ws => {
    console.log('Client connected');

    // Initialize state for this connection
    ws.playerState = {
        location: "forest", // Starting location
        inventory: ["rusty sword"] // Starting inventory
    };

    // Send initial location description to the newly connected client
    handleCommand(ws, ["look"]); // Use handleCommand to send initial state

    // Handle messages from this client
    ws.on('message', message => {
        console.log(`Received message from client: ${message}`);
        const commandParts = message.toString().trim().split(" ");
        if (commandParts.length > 0 && commandParts[0] !== "") {
             handleCommand(ws, commandParts);
        }
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