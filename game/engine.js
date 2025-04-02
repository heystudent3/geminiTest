// Main game engine - manages game state and processes commands

const World = require('./world');
const Player = require('./player');
const Items = require('./items');
const Combat = require('./combat');

// Store active players (mapping ws connection or player ID to Player object)
const activePlayers = new Map();

function initializePlayer(ws, playerName = "Hero") {
    const player = new Player(playerName);
    activePlayers.set(ws, player); // Associate player object with WebSocket connection
    return player;
}

function getPlayer(ws) {
    return activePlayers.get(ws);
}

function removePlayer(ws) {
    activePlayers.delete(ws);
}

// Processes a command for a given player (ws)
function processCommand(ws, commandParts) {
    const player = getPlayer(ws);
    if (!player) {
        return "Error: Player not found."; // Should not happen if initialized correctly
    }

    const command = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);
    let response = `Unknown command: '${command}'.`; // Default response

    const currentLocation = World.getLocation(player.locationId);
    if (!currentLocation) {
         return `Error: Current location '${player.locationId}' not found in world data.`;
    }

    // --- Command Handling ---
    // TODO: Add combat state handling

    switch (command) {
        case "look":
            let description = currentLocation.description;
            // TODO: List items in location
            // TODO: List enemies in location
            response = description + `\nExits: ${Object.keys(currentLocation.exits).join(', ')}`;
            break;

        case "north":
        case "south":
        case "east":
        case "west":
            if (currentLocation.exits[command]) {
                player.locationId = currentLocation.exits[command];
                const newLocation = World.getLocation(player.locationId);
                response = `You go ${command}.\n\n${newLocation.description}\nExits: ${Object.keys(newLocation.exits).join(', ')}`;
                // TODO: Check for enemies/trigger combat?
            } else {
                response = `You cannot go ${command} from here.`;
            }
            break;

        case "inventory":
        case "inv":
            if (player.inventory.length === 0) {
                response = "Your inventory is empty.";
            } else {
                // TODO: Get item names properly if inventory stores IDs
                response = `Inventory: ${player.inventory.join(', ')}`;
            }
            break;

        case "get":
            // TODO: Implement getting items from location
             response = "Get command not fully implemented yet.";
            break;

        case "attack":
             // TODO: Implement starting combat
             response = "Attack command not fully implemented yet.";
            break;

        // Add more commands: equip, use, talk, etc.
    }

    return response;
}


module.exports = {
    initializePlayer,
    getPlayer,
    removePlayer,
    processCommand,
};