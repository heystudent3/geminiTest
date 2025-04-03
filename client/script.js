// Main Client Script
// Initializes the game engine, world, player, entities, and starts the game loop.

// --- Game Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing game...");

    // Instantiate the core components
    // Note: Assumes the class definitions from other files are loaded globally
    // In a module system, you would use import statements.
    const engine = new GameEngine('game-console', 'player-status', 'message-log');
    const world = new World(engine.consoleWidth, engine.consoleHeight - 5); // Reserve some height for status/log if integrated later
    const combatManager = new CombatManager(engine); // Instantiate combat manager

    // Generate the initial map
    world.generateMap('simple_room'); // Use the simple generator for now

    // Create the player
    const startPos = world.getStartingPosition();
    const player = new Player(startPos.x, startPos.y, "Hero");

    // Assign components to the engine
    engine.map = world;
    engine.player = player;
    engine.combatManager = combatManager; // Add combat manager to engine

    // --- Entity Spawning (Example) ---
    engine.enemies = [];
    engine.items = [];

    // Spawn some enemies based on concept preview
    const goblin = createEnemy('GOBLIN', 15, 5); // Using the factory function
    if (goblin && !world.isSolid(goblin.x, goblin.y)) {
        engine.enemies.push(goblin);
        engine.addLogMessage(`A wild ${goblin.name} appears!`);
    } else {
         console.warn("Could not place Goblin at specified location.");
    }


    const skeleton = createEnemy('SKELETON', 20, 12);
     if (skeleton && !world.isSolid(skeleton.x, skeleton.y)) {
        engine.enemies.push(skeleton);
        engine.addLogMessage(`A rattling ${skeleton.name} stands guard.`);
    } else {
         console.warn("Could not place Skeleton at specified location.");
    }

    // Spawn some items based on concept preview
    const gold = createItem('gold', 10, 8, { amount: 10 });
    if (gold && !world.isSolid(gold.x, gold.y)) {
        engine.items.push(gold);
    }

    const potion = createItem('healing_potion', 25, 15);
     if (potion && !world.isSolid(potion.x, potion.y)) {
        engine.items.push(potion);
    }

     const sword = createItem('basic_sword', 18, 10);
     if (sword && !world.isSolid(sword.x, sword.y)) {
        engine.items.push(sword);
    }


    // --- Input Handling ---
    document.addEventListener('keydown', (event) => {
        engine.handleInput(event); // Pass the event to the engine
    });

    // --- Start Game ---
    engine.startGameLoop(); // Render the initial state (e.g., start menu or game world)

    console.log("Game initialization complete.");
});

// --- Refinements needed later ---
// 1. Proper Module Loading (ES Modules or other) instead of relying on global scope.
// 2. More sophisticated map generation and entity placement.
// 3. Saving/Loading implementation.
// 4. Full implementation of combat, skills, inventory management within the engine/managers.
// 5. Refined rendering in engine.js to draw map, player, items, enemies correctly.
// 6. Refined input handling in engine.js for different game states.