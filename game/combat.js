// Combat Module
// Handles combat encounters, turn management, actions, and enemy definitions.

// --- Basic Enemy Class ---
// Could be expanded into its own file (e.g., game/enemies.js) later
class Enemy {
    constructor(x, y, name, char, color, stats) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.char = char; // ASCII representation
        this.color = color; // CSS class for color

        // Basic Stats
        this.hp = stats.hp || 10;
        this.maxHp = stats.maxHp || 10;
        this.attackPower = stats.attackPower || 3;
        this.defense = stats.defense || 0;
        this.xpValue = stats.xpValue || 10; // XP awarded on defeat
        this.lootTable = stats.lootTable || []; // Potential items dropped

        this.isAlive = true;
        this.aiState = 'idle'; // e.g., idle, chasing, attacking
    }

    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.defense);
        this.hp -= actualDamage;
        console.log(`${this.name} took ${actualDamage} damage. HP: ${this.hp}/${this.maxHp}`);
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() {
        console.log(`${this.name} has been defeated!`);
        this.isAlive = false;
        this.char = '%'; // Change appearance on death (e.g., corpse)
        this.color = 'color-wall'; // Dim color
        // Drop loot logic would go here
    }

    // Basic AI action (can be expanded significantly)
    act(player, world) {
        if (!this.isAlive) return;

        // Simple AI: If adjacent to player, attack. Otherwise, maybe move randomly or towards player.
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0)) {
            // Adjacent to player, attack!
            console.log(`${this.name} attacks ${player.name}!`);
            player.takeDamage(this.attackPower);
            // Add log message in engine
        } else {
            // Basic movement towards player (if path exists - simplified for now)
            // This needs proper pathfinding later
            let moveX = this.x, moveY = this.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                moveX += Math.sign(dx);
            } else if (dy !== 0) {
                moveY += Math.sign(dy);
            }
            // Check if the target tile is valid before moving
            if (!world.isSolid(moveX, moveY)) { // Basic check, doesn't account for other enemies
                 this.x = moveX;
                 this.y = moveY;
                 console.log(`${this.name} moves towards player to (${this.x}, ${this.y})`);
            } else {
                 console.log(`${this.name} holds position.`);
            }

        }
    }

     getPosition() {
        return { x: this.x, y: this.y };
    }
}

// --- Combat Manager ---
// This might be integrated directly into the GameEngine or kept separate
class CombatManager {
    constructor(engine) {
        this.engine = engine; // Reference to the main game engine
        this.combatants = []; // List of participants (player, enemies)
        this.turnIndex = 0;
        this.isInCombat = false;
    }

    startCombat(player, enemies) {
        if (this.isInCombat) return;

        console.log("Combat started!");
        this.engine.gameState = 'combat';
        this.engine.addLogMessage("--- Combat Started! ---");

        this.combatants = [player, ...enemies.filter(e => e.isAlive)]; // Only include living enemies
        this.turnIndex = 0; // Player usually goes first
        this.isInCombat = true;

        // Initial render of combat state (might involve changing the console layout)
        this.engine.render(); // Trigger re-render for combat UI
        this.nextTurn();
    }

    endCombat(victory) {
        console.log("Combat ended.");
        this.isInCombat = false;
        this.combatants = [];
        this.turnIndex = 0;
        this.engine.gameState = 'playing'; // Return to exploration

        if (victory) {
            this.engine.addLogMessage("--- Victory! ---");
            // Award XP, handle loot drops from defeated enemies
        } else {
            this.engine.addLogMessage("--- Defeated or Fled ---");
            // Handle player death or flee consequences
        }
        this.engine.render(); // Trigger re-render for map view
    }

    nextTurn() {
        if (!this.isInCombat) return;

        const currentCombatant = this.combatants[this.turnIndex];

        if (!currentCombatant || !currentCombatant.isAlive) {
            // Skip dead combatants
            this.advanceTurn();
            return;
        }

        if (currentCombatant instanceof Player) {
            // Player's turn - wait for input
            this.engine.addLogMessage("Your turn. Choose an action: [A]ttack, [S]kill, [I]tem, [F]lee");
            // Input handling will be done in the engine based on 'combat' state
        } else if (currentCombatant instanceof Enemy) {
            // Enemy's turn - execute AI
            this.engine.addLogMessage(`${currentCombatant.name}'s turn.`);
            currentCombatant.act(this.engine.player, this.engine.map); // Pass player and world context
            this.engine.render(); // Re-render after enemy action
            // Check combat end condition after enemy action
             if (this.checkCombatEnd()) return;
            this.advanceTurn(); // Automatically move to next turn after AI acts
        }
    }

    advanceTurn() {
        this.turnIndex = (this.turnIndex + 1) % this.combatants.length;
        // Skip turns for any combatants that died mid-round
        while(!this.combatants[this.turnIndex]?.isAlive && this.isInCombat) {
             this.turnIndex = (this.turnIndex + 1) % this.combatants.length;
             // Safety break if somehow all are dead but combat didn't end
             if (this.combatants.every(c => !c.isAlive)) break;
        }
        this.nextTurn(); // Start the next turn
    }

    handlePlayerAction(action, target) {
        if (!this.isInCombat || !(this.combatants[this.turnIndex] instanceof Player)) {
            return; // Not player's turn or not in combat
        }

        const player = this.combatants[this.turnIndex];
        let actionTaken = false;

        switch (action) {
            case 'attack':
                if (target instanceof Enemy && target.isAlive) {
                    this.engine.addLogMessage(`You attack ${target.name}!`);
                    target.takeDamage(player.attackPower);
                    actionTaken = true;
                } else {
                    this.engine.addLogMessage("Invalid attack target.");
                }
                break;
            case 'skill':
                // Placeholder for skill logic
                this.engine.addLogMessage("Skills not implemented yet.");
                break;
            case 'item':
                // Placeholder for item logic
                this.engine.addLogMessage("Using items in combat not implemented yet.");
                break;
            case 'flee':
                // Placeholder for flee logic (chance based on stats?)
                const fleeSuccess = Math.random() < 0.5; // 50% chance for now
                if (fleeSuccess) {
                    this.engine.addLogMessage("You successfully flee!");
                    this.endCombat(false); // End combat as fled
                    return; // Exit early as combat ended
                } else {
                    this.engine.addLogMessage("You failed to flee!");
                    actionTaken = true; // Failed flee still uses the turn
                }
                break;
            default:
                this.engine.addLogMessage("Unknown action.");
        }

        if (actionTaken) {
             this.engine.render(); // Re-render after player action
             // Check combat end condition after player action
             if (this.checkCombatEnd()) return;
             this.advanceTurn(); // Move to the next combatant's turn
        }
    }

     checkCombatEnd() {
        const livingEnemies = this.combatants.filter(c => c instanceof Enemy && c.isAlive);
        const playerAlive = this.engine.player.isAlive; // Check player directly from engine

        if (!playerAlive) {
            this.endCombat(false); // Player defeated
            return true;
        }

        if (livingEnemies.length === 0) {
            this.endCombat(true); // All enemies defeated
            return true;
        }

        return false; // Combat continues
    }
}

// --- Enemy Definitions ---
// Could be loaded from a data file later
const ENEMY_TYPES = {
    GOBLIN: {
        name: "Goblin",
        char: 'G',
        color: 'color-enemy',
        stats: { hp: 12, maxHp: 12, attackPower: 4, defense: 1, xpValue: 15, lootTable: [{ type: 'gold', chance: 0.5, amount: 5 }] }
    },
    SKELETON: {
        name: "Skeleton",
        char: 'S',
        color: 'color-player', // White like bones
        stats: { hp: 20, maxHp: 20, attackPower: 5, defense: 2, xpValue: 25, lootTable: [{ type: 'basic_sword', chance: 0.1 }] }
    },
    BAT: {
        name: "Giant Bat",
        char: 'B',
        color: 'color-wall', // Dark color
        stats: { hp: 8, maxHp: 8, attackPower: 3, defense: 0, xpValue: 8 }
    }
};

function createEnemy(type, x, y) {
    const definition = ENEMY_TYPES[type];
    if (!definition) {
        console.warn(`Unknown enemy type requested: ${type}`);
        // Create a default fallback enemy
        return new Enemy(x, y, 'Unknown Creature', '?', 'color-enemy', { hp: 5, attackPower: 1, xpValue: 1 });
    }
    // Deep copy stats to avoid modification issues if multiple enemies of same type exist
    const statsCopy = JSON.parse(JSON.stringify(definition.stats));
    return new Enemy(x, y, definition.name, definition.char, definition.color, statsCopy);
}


// Export classes/functions if using modules
// export { Enemy, CombatManager, createEnemy, ENEMY_TYPES };