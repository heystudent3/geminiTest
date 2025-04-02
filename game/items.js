// Defines game items and their properties

const items = {
    // Weapons
    'stick': {
        id: 'stick',
        name: 'Wooden Stick',
        type: 'weapon',
        description: 'A sturdy stick, good for whacking.',
        stats: { attack: 1 },
    },
    'rusty_sword': {
        id: 'rusty_sword',
        name: 'Rusty Sword',
        type: 'weapon',
        description: 'An old sword, pitted with rust.',
        stats: { attack: 2 },
    },

    // Armor (example)
    'leather_cap': {
        id: 'leather_cap',
        name: 'Leather Cap',
        type: 'armor', // Could specify slot: 'head'
        description: 'A simple cap made of hardened leather.',
        stats: { defense: 1 },
    },

    // Other items
    'shiny_gem': {
        id: 'shiny_gem',
        name: 'Shiny Gem',
        type: 'misc',
        description: 'A small, sparkling gemstone.',
        value: 10, // Example property
    },
    // Add more items
};

function getItem(itemId) {
    return items[itemId];
}

module.exports = {
    getItem,
    // Function to get all items, etc.
};