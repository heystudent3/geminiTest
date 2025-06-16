// Achievement Definitions
// This module defines all achievements available in the game.

const ACHIEVEMENTS = {
    // Progression Achievements
    FIRST_LEVEL: {
        id: 'FIRST_LEVEL',
        name: 'Novice Adventurer',
        description: 'Reach Level 2 for the first time.',
        criteria: { type: 'playerLevel', targetValue: 2 },
        reward: { type: 'xp', amount: 50 }
    },
    TEN_LEVELS: {
        id: 'TEN_LEVELS',
        name: 'Seasoned Explorer',
        description: 'Reach Level 10.',
        criteria: { type: 'playerLevel', targetValue: 10 },
        reward: { type: 'xp', amount: 200 }
    },
    // Combat Achievements
    FIRST_KILL: {
        id: 'FIRST_KILL',
        name: 'First Blood',
        description: 'Defeat your first enemy.',
        criteria: { type: 'enemiesKilled', targetValue: 1 },
        reward: { type: 'xp', amount: 25 }
    },
    TEN_KILLS: {
        id: 'TEN_KILLS',
        name: 'Monster Slayer',
        description: 'Defeat 10 enemies.',
        criteria: { type: 'enemiesKilled', targetValue: 10 },
        reward: { type: 'xp', amount: 100 }
    },
    // Item Achievements
    FIRST_ITEM: {
        id: 'FIRST_ITEM',
        name: 'Hoarder Beginnings',
        description: 'Pick up your first item (excluding currency).',
        criteria: { type: 'itemsPickedUp', targetValue: 1 },
        reward: { type: 'xp', amount: 15 }
    }
    // Add more achievements as needed
};

// Export ACHIEVEMENTS if using ES modules
// export { ACHIEVEMENTS };

// For CommonJS/Node environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ACHIEVEMENTS };
}
