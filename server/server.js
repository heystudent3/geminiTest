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

// Player character
const player = {
    location: "forest",
    inventory: ["rusty sword"]
};

wss.on('connection', ws => {
    console.log('Client connected');

    ws.send(locations[player.location].description + ` You have: ${player.inventory.join(", ")}`); // Send initial location description

ws.on('message', message => {
    console.log(`Received message: ${message}`);
    const command = message.toString().trim().split(" "); // Convert message to string, trim whitespace, and split into command and arguments
    let response = "";

    switch (command[0]) {
        case "look":
            let description = locations[player.location].description;
            if (locations[player.location].enemy) {
                description += ` A ${locations[player.location].enemy} is here.`;
            }
            response = description + ` You have: ${player.inventory.join(", ")}`;
            break;
        case "north":
            if (locations[player.location].north) {
                player.location = locations[player.location].north;
                let description = locations[player.location].description;
                if (locations[player.location].enemy) {
                    description += ` A ${locations[player.location].enemy} is here.`;
                }
                response = locations[player.location].description + ` You have: ${player.inventory.join(", ")}`;
            } else {
                response = "You cannot go north from here.";
            }
            break;
        case "east":
             if (locations[player.location].east) {
                player.location = locations[player.location].east;
                response = locations[player.location].description + ` You have: ${player.inventory.join(", ")}`;
            } else {
                response = "You cannot go east from here.";
            }
            break;
        case "inventory":
            response = `You have: ${player.inventory.join(", ")}`;
            break;
        case "get":
            if (locations[player.location].item) {
                const item = locations[player.location].item;
                player.inventory.push(item);
                delete locations[player.location].item;
                response = `You got the ${item}. You have: ${player.inventory.join(", ")}`;
            } else {
                response = "There is nothing to get here.";
            }
            break;
        case "attack":
            if (locations[player.location].enemy) {
                const enemy = locations[player.location].enemy;
                delete locations[player.location].enemy;
                response = `You attack the ${enemy} with your rusty sword and defeat it!`;
            } else {
                response = "There is nothing to attack here.";
            }
            break;
        default:
            response = `Unknown command: ${command[0]}. Try 'look', 'north', 'east', 'inventory', 'get', or 'attack'.`;
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