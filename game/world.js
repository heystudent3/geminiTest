// Defines the game world, locations, and potentially NPCs/enemies within them.

const locations = {
    'town_square': {
        id: 'town_square',
        name: 'Town Square',
        description: 'You are in the bustling town square. Cobblestone paths lead north, south, east, and west. A fountain bubbles in the center.',
        exits: {
            north: 'north_gate',
            east: 'market_street',
            south: 'south_gate',
            west: 'tavern',
        },
        items: [],
        enemies: [],
    },
    'north_gate': {
        id: 'north_gate',
        name: 'North Gate',
        description: 'You stand at the sturdy North Gate of the town. The road leads north out into the wilderness. The town square is to the south.',
        exits: {
            north: 'forest_path', // Example exit to outside town
            south: 'town_square',
        },
        items: [],
        enemies: [],
    },
    'market_street': {
        id: 'market_street',
        name: 'Market Street',
        description: 'Merchants hawk their wares along this busy street. The town square is to the west.',
        exits: {
            west: 'town_square',
        },
        items: [], // TODO: Add items later
        enemies: [],
    },
    'south_gate': {
        id: 'south_gate',
        name: 'South Gate',
        description: 'You are at the South Gate. The town square is to the north.',
        exits: {
            north: 'town_square',
        },
        items: [],
        enemies: [],
    },
    'tavern': {
        id: 'tavern',
        name: 'The Drunken Dragon Tavern',
        description: 'The air is thick with smoke and chatter. A burly bartender polishes a mug. The town square is to the east.',
        exits: {
            east: 'town_square',
        },
        items: [],
        enemies: [], // TODO: Add NPCs later
    },
     'forest_path': {
        id: 'forest_path',
        name: 'Forest Path',
        description: 'A winding path leads deeper into the dark forest. The North Gate is to the south.',
        exits: {
            south: 'north_gate',
            // north: 'deep_forest' // Example deeper area
        },
        items: ['stick'], // Example item
        enemies: ['goblin'], // Example enemy
    },
    // Add more locations as needed
};

function getLocation(locationId) {
    return locations[locationId];
}

module.exports = {
    getLocation,
    // We might add functions later like getEnemiesInLocation, getItemsInLocation, etc.
};