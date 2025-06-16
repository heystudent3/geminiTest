// Game Engine Module
// Responsible for the main game loop, state management, rendering, and input handling.

class GameEngine {
    constructor(consoleElementId, statusElementId, logElementId) {
        this.consoleElement = document.getElementById(consoleElementId);
        this.statusElement = document.getElementById(statusElementId);
        this.logElement = document.getElementById(logElementId);

        this.gameState = 'initializing'; // e.g., initializing, start_menu, playing, combat, game_over
        this.map = null; // Will hold the current World object
        this.player = null; // Will hold the Player object
        this.enemies = []; // List of enemies on the current map
        this.items = []; // List of items on the current map
        this.combatManager = null; // Will hold the CombatManager instance

        // Console dimensions (example, can be adjusted)
        this.consoleWidth = 80;
        this.consoleHeight = 25;

        // Buffer for rendering to the console
        this.consoleBuffer = Array(this.consoleHeight).fill(null).map(() => Array(this.consoleWidth).fill({ char: ' ', color: 'inherit', bgColor: 'inherit' }));

        console.log("Game Engine Initializing...");
        this.addLogMessage("Engine initialized. Welcome!");
    }

    // --- Game Loop ---
    startGameLoop() {
        // Start directly in 'playing' state for testing movement/rendering
        this.gameState = 'playing';
        console.log("Starting game loop in 'playing' state...");
        this.addLogMessage("Game starting... Explore!");
        // Initial render
        this.render();
        // Start the actual loop
        this.gameTick();
    }


    gameTick() {
        // Main loop logic goes here:
        // 1. Process Input (Handled by event listener calling handleInput)
        // 2. Update Game State (Enemy AI, other time-based events)
        this.update();
        // 3. Render Output
        this.render();

        requestAnimationFrame(() => this.gameTick()); // Keep the loop running
    }


    // --- State Management ---
    update() {
        // Update logic based on gameState
        if (!this.player || !this.map) return; // Don't update if core components aren't ready

        switch (this.gameState) {
            case 'playing':
                // Update Enemies (basic AI)
                this.enemies.forEach(enemy => {
                    if (enemy.isAlive) {
                        // Basic check: only act if player is nearby? (Simple optimization)
                        const dx = Math.abs(this.player.x - enemy.x);
                        const dy = Math.abs(this.player.y - enemy.y);
                        if (dx < this.consoleWidth / 2 && dy < this.consoleHeight / 2) {
                             // Enemy AI logic (e.g., move towards player) - currently in combat.js Enemy.act
                             // For non-combat movement/actions:
                             // enemy.updateAI(this.player, this.map);
                        }
                    }
                });
                break;
            case 'combat':
                // Combat logic is handled turn-by-turn via CombatManager, triggered by input
                break;
            // Add other states
        }
    }

    // --- Rendering ---
    render() {
        // console.log("Rendering frame..."); // Reduce console noise
        if (!this.player || !this.map) {
             this.renderMessage("Loading...");
             this.drawConsole();
             return;
        }
        // Clear buffer before drawing new frame
        this.clearConsoleBuffer(); // Clear before drawing new frame

        // Render based on gameState
        switch (this.gameState) {
            case 'initializing':
                this.renderMessage("Initializing...");
                break;
            case 'start_menu':
                this.renderStartMenu();
                break;
            case 'playing':
                this.renderMap();
                this.renderItems();
                this.renderEnemies();
                this.renderPlayer(); // Render player last so they appear on top
                break;
            // Add other states
            default:
                this.renderMessage("Unknown State");
        }

        // Draw the buffer to the actual console element
        this.drawConsole();
        this.updateStatusUI(); // Update HP/MP etc.
    }

    clearConsoleBuffer() {
        for (let y = 0; y < this.consoleHeight; y++) {
            for (let x = 0; x < this.consoleWidth; x++) {
                this.consoleBuffer[y][x] = { char: ' ', color: 'inherit', bgColor: 'transparent' }; // Use transparent bg
            }
        }
    }

    renderMessage(message, y = Math.floor(this.consoleHeight / 2), color = 'color-default') {
        this.clearConsoleBuffer();
        const x = Math.floor((this.consoleWidth - message.length) / 2);
        for (let i = 0; i < message.length; i++) {
            if (x + i < this.consoleWidth) {
                this.consoleBuffer[y][x + i] = { char: message[i], color: color, bgColor: 'transparent' };
            }
        }
    }

    renderStartMenu() {
        this.clearConsoleBuffer();
        const title = "ASCII RPG";
        const options = ["[ New Character ]", "[ Load Character ]"]; // Example options
        let currentY = Math.floor(this.consoleHeight / 2) - 2;

        // Draw Title
        let titleX = Math.floor((this.consoleWidth - title.length) / 2);
        for (let i = 0; i < title.length; i++) {
            this.consoleBuffer[currentY][titleX + i] = { char: title[i], color: 'color-item', bgColor: 'transparent' };
        }
        currentY += 2;

        // Draw Options
        options.forEach((option, index) => {
            let optionX = Math.floor((this.consoleWidth - option.length) / 2);
            // Add highlighting for selected option later
            let color = 'color-default'; // Default color
            if (index === 0) { // Example: Highlight first option
                 color = 'color-highlight'; // This needs CSS for background or different text color
                 // Or modify the string: option = `< ${option.substring(2, option.length - 2)} >`;
            }

            for (let i = 0; i < option.length; i++) {
                 this.consoleBuffer[currentY][optionX + i] = { char: option[i], color: color, bgColor: 'transparent' };
            }
            currentY++;
        });
    }

    renderMap() {
        if (!this.map) return;
        for (let y = 0; y < this.consoleHeight; y++) {
            for (let x = 0; x < this.consoleWidth; x++) {
                // TODO: Implement camera/viewport scrolling later
                const mapTile = this.map.getTile(x, y); // For now, map coords = console coords
                if (mapTile) {
                    this.consoleBuffer[y][x] = {
                        char: mapTile.char,
                        color: mapTile.color,
                        bgColor: 'transparent' // Or tile-specific background
                    };
                }
            }
        }
    }

    renderItems() {
        if (!this.items) return;
        this.items.forEach(item => {
            // TODO: Check if item is within viewport
            if (item.x >= 0 && item.x < this.consoleWidth && item.y >= 0 && item.y < this.consoleHeight) {
                 // Only draw if the tile underneath is not solid (e.g., don't draw items inside walls)
                 const underlyingTile = this.map.getTile(item.x, item.y);
                 // Also check if player is NOT on the same tile (player renders on top)
                 if (underlyingTile && !underlyingTile.solid && !(this.player && this.player.x === item.x && this.player.y === item.y)) {
                    this.consoleBuffer[item.y][item.x] = {
                        char: item.char,
                        color: item.color,
                        bgColor: 'transparent' // Or maybe highlight background?
                    };
                 }
            }
        });
    }

     renderEnemies() {
        if (!this.enemies) return;
        this.enemies.forEach(enemy => {
            // TODO: Check if enemy is within viewport
            if (enemy.x >= 0 && enemy.x < this.consoleWidth && enemy.y >= 0 && enemy.y < this.consoleHeight) {
                 // Only draw if the tile underneath is not solid and player is not there
                 const underlyingTile = this.map.getTile(enemy.x, enemy.y);
                  if (underlyingTile && !underlyingTile.solid && !(this.player && this.player.x === enemy.x && this.player.y === enemy.y)) {
                    this.consoleBuffer[enemy.y][enemy.x] = {
                        char: enemy.isAlive ? enemy.char : '%', // Show corpse symbol if dead
                        color: enemy.isAlive ? enemy.color : 'color-wall',
                        bgColor: 'transparent'
                    };
                 }
            }
        });
    }

    renderPlayer() {
        if (!this.player) return;
        // TODO: Check if player is within viewport (should always be if centered)
        if (this.player.x >= 0 && this.player.x < this.consoleWidth && this.player.y >= 0 && this.player.y < this.consoleHeight) {
            this.consoleBuffer[this.player.y][this.player.x] = {
                char: this.player.char,
                color: this.player.color,
                bgColor: 'transparent'
            };
        }
    }
    drawConsole() {
        // More efficient DOM update: build string then set innerHTML once.
        let html = '';
        for (let y = 0; y < this.consoleHeight; y++) {
            for (let x = 0; x < this.consoleWidth; x++) {
                const cell = this.consoleBuffer[y][x] || { char: ' ', color: 'inherit', bgColor: 'transparent' };
                // Apply default color if 'inherit'
                const colorClass = cell.color === 'inherit' ? 'color-default' : cell.color;
                html += `<span class="${colorClass}" style="background-color:${cell.bgColor};">${cell.char}</span>`;
            }
            html += '\n';
        }
        this.consoleElement.innerHTML = html;
    }


     updateStatusUI() {
        if (!this.player || !this.statusElement) return;
        // Update player status display (HP, MP, Level, XP)
        // Find the specific divs/spans if they exist, otherwise update the whole block
        const hpElement = this.statusElement.querySelector('#player-hp');
        const mpElement = this.statusElement.querySelector('#player-mp');
        const levelElement = this.statusElement.querySelector('#player-level');
        const xpElement = this.statusElement.querySelector('#player-xp');
        const posElement = this.statusElement.querySelector('#player-pos');

        // Fallback to innerHTML if specific elements aren't found
        this.statusElement.innerHTML = `
            <h2>Status</h2>
            <p>HP: <span id="player-hp">${this.player.hp}/${this.player.maxHp}</span></p>
            <p>MP: <span id="player-mp">${this.player.mp}/${this.player.maxMp}</span></p>
            <p>Level: <span id="player-level">${this.player.level}</span></p>
            <p>XP: <span id="player-xp">${this.player.xp}/${this.player.xpToNextLevel}</span></p>
            <p>Pos: <span id="player-pos">(${this.player.x}, ${this.player.y})</span></p>
        `;
    }


    // --- Logging ---
    addLogMessage(message) {
        const newMessage = document.createElement('p');
        newMessage.textContent = message;
        this.logElement.appendChild(newMessage);
        // Auto-scroll to bottom
        this.logElement.scrollTop = this.logElement.scrollHeight;
        console.log(`LOG: ${message}`);
    }

    // --- Input Handling ---
    handleInput(event) {
        if (!this.player || !this.map) return; // Can't handle input without player/map

        let dx = 0;
        let dy = 0;
        let actionTaken = false;
        let turnAdvanced = false; // Track if the player's turn should advance

        switch (this.gameState) {
            case 'start_menu':
                this.addLogMessage(`Menu input (${event.key}) not implemented yet.`);
                break;

            case 'playing':
                // Handle movement (WASD or Arrows)
                switch (event.key) {
                    case 'w': case 'ArrowUp':    dy = -1; actionTaken = true; break;
                    case 's': case 'ArrowDown':  dy = 1;  actionTaken = true; break;
                    case 'a': case 'ArrowLeft':  dx = -1; actionTaken = true; break;
                    case 'd': case 'ArrowRight': dx = 1;  actionTaken = true; break;
                    // Add keys for interaction (e.g., 'g' to get items, 'o'/'c' to open/close doors?)
                    // case 'g': // Get item command
                    //     this.checkForItems(true); // Pass flag to force pickup attempt
                    //     actionTaken = true; // Even if nothing is there, counts as an action
                    //     break;
                }

                if (actionTaken && (dx !== 0 || dy !== 0)) { // Only process movement actions here
                    const newX = this.player.x + dx;
                    const newY = this.player.y + dy;

                    // Check for enemies at the target location first
                    const enemyAtTarget = this.enemies.find(e => e.isAlive && e.x === newX && e.y === newY);
                    if (enemyAtTarget) {
                        this.addLogMessage(`You attack ${enemyAtTarget.name}!`);
                        // Initiate Combat (or just attack if already in combat - though state should be 'combat')
                        if (this.combatManager && !this.combatManager.isInCombat) {
                             this.combatManager.startCombat(this.player, this.enemies.filter(e => e.isAlive && Math.abs(e.x - this.player.x) < 10 && Math.abs(e.y - this.player.y) < 10)); // Start combat with nearby enemies
                             // Don't advance turn here, combat manager handles turns
                        } else if (!this.combatManager) {
                             this.addLogMessage("Combat system not ready.");
                        }
                        // If already in combat, this input shouldn't happen in 'playing' state
                    } else {
                        // Attempt to move
                        const moved = this.player.move(dx, dy, this.map);
                        if (moved) {
                            // Check for items automatically upon landing on tile
                            this.checkForItems(false); // Auto-pickup check
                            turnAdvanced = true; // Player successfully moved, advance turn
                        } else {
                             // Check for interactions with solid tiles (e.g., doors)
                             const targetTile = this.map.getTile(newX, newY);
                             if (targetTile === TILE_TYPES.DOOR_CLOSED) {
                                 this.map.setTile(newX, newY, TILE_TYPES.DOOR_OPEN);
                                 this.addLogMessage("You opened the door.");
                                 turnAdvanced = true; // Opening a door takes a turn
                             } else if (targetTile === TILE_TYPES.DOOR_OPEN) {
                                 // Maybe implement closing doors later?
                                 this.addLogMessage("This door is already open.");
                                 // No turn advanced if bumping into open door
                             } else {
                                 this.addLogMessage(`Blocked by ${targetTile.description}.`);
                                 // No turn advanced if bumping into wall/solid object
                             }
                        }
                    }
                } else if (actionTaken) {
                     // Handle non-movement actions if any were added (like 'g' get)
                     turnAdvanced = true; // Assume non-movement actions take a turn
                }

                // If player took an action that advances the turn, let enemies act
                if (turnAdvanced) {
                    this.updateEnemyTurns();
                    // --- START Random Feature ---
                    if (Math.random() < 0.2) { // 20% chance to add a random flavor message
                        const flavorMessages = [
                            "A gentle breeze whispers past.",
                            "You hear a faint, distant howl.",
                            "The ground trembles slightly.",
                            "A strange symbol flashes in your mind's eye.",
                            "You feel a momentary surge of energy."
                        ];
                        const randomIndex = Math.floor(Math.random() * flavorMessages.length);
                        this.addLogMessage(flavorMessages[randomIndex]);
                    }
                    // --- END Random Feature ---
                }

                break; // End case 'playing'

            case 'combat':
                 if (this.combatManager && this.combatManager.isInCombat) {
                     // Let combat manager handle input
                     let combatAction = null;
                     let target = null; // Determine target based on input/state
                     switch (event.key.toLowerCase()) {
                         case 'a':
                             combatAction = 'attack';
                             // Simple target selection: first living enemy
                             target = this.combatManager.combatants.find(c => c instanceof Enemy && c.isAlive);
                             if (!target) this.addLogMessage("No target to attack!");
                             break;
                         case 'f':
                             combatAction = 'flee';
                             break;
                         // Add cases for 's' (skill), 'i' (item) later
                         default:
                             this.addLogMessage("Invalid combat command: [A]ttack, [F]lee");
                     }
                     if (combatAction) {
                         // handlePlayerAction advances turn internally if successful
                         this.combatManager.handlePlayerAction(combatAction, target);
                     }
                 } else {
                     this.addLogMessage("Not in active combat.");
                 }
                break; // End case 'combat'

            // Add other states
        }

        // Rendering is handled by the continuous game loop (requestAnimationFrame)
    }

     updateEnemyTurns() {
         if (this.gameState !== 'playing') return; // Enemies only act in playing state for now (combat handled separately)

         this.enemies.forEach(enemy => {
             if (enemy.isAlive) {
                 // Basic AI: Move towards player if nearby, otherwise maybe random move?
                 const dx = this.player.x - enemy.x;
                 const dy = this.player.y - enemy.y;
                 const distance = Math.sqrt(dx*dx + dy*dy);

                 if (distance < 8) { // Aggro range
                     // Check if adjacent (for attacking in playing state? Or just move?)
                     if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && distance > 0) {
                         // If we allow attacking outside formal combat:
                         // console.log(`${enemy.name} attacks ${this.player.name} (outside combat)!`);
                         // this.player.takeDamage(enemy.attackPower);
                         // this.addLogMessage(`${enemy.name} hits you!`);
                         // OR: Initiate combat if adjacent
                         if (this.combatManager && !this.combatManager.isInCombat) {
                             this.addLogMessage(`${enemy.name} engages you!`);
                             this.combatManager.startCombat(this.player, this.enemies.filter(e => e.isAlive && Math.abs(e.x - this.player.x) < 10 && Math.abs(e.y - this.player.y) < 10));
                         }
                     } else {
                         // Move towards player (simple pathfinding)
                         let moveX = enemy.x;
                         let moveY = enemy.y;
                         if (Math.abs(dx) > Math.abs(dy)) {
                             moveX += Math.sign(dx);
                         } else if (dy !== 0) {
                             moveY += Math.sign(dy);
                         } else if (dx !== 0) { // Move horizontally if dy is 0 but dx is not
                             moveX += Math.sign(dx);
                         }

                         // Check if target tile is valid (not solid, not occupied by another enemy/player)
                         const targetTile = this.map.getTile(moveX, moveY);
                         const isOccupied = this.enemies.some(e => e.isAlive && e.x === moveX && e.y === moveY) || (this.player.x === moveX && this.player.y === moveY);

                         if (targetTile && !targetTile.solid && !isOccupied) {
                             enemy.x = moveX;
                             enemy.y = moveY;
                             // console.log(`${enemy.name} moves to (${enemy.x}, ${enemy.y})`); // Reduce noise
                         }
                     }
                 } else {
                     // Idle behavior (e.g., random movement) - Optional
                 }
             }
         });
     }


     checkForItems(forcePickupAttempt = false) {
        const itemIndex = this.items.findIndex(item => item.x === this.player.x && item.y === this.player.y);
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            this.addLogMessage(`You are standing on ${item.name}.`);

            // Auto-pickup currency, otherwise require action? Or auto-pickup all for now.
            if (item.type === 'currency') {
                // Handle currency specifically (e.g., add to player gold stat directly)
                // Assuming player has a 'gold' property or similar
                this.player.gold = (this.player.gold || 0) + item.properties.amount;
                this.addLogMessage(`Picked up ${item.properties.amount} gold. Total: ${this.player.gold}`);
                // Remove item from world
                this.items.splice(itemIndex, 1);
            } else {
                 // Attempt to add other items to inventory
                 const pickedUp = this.player.addItem(item); // addItem logs success/failure
                 if (pickedUp) {
                     // Remove item from world map
                     item.x = null; // No longer on map
                     item.y = null;
                     this.items.splice(itemIndex, 1); // Remove from world item list
                 } else {
                     // Inventory full message is handled by player.addItem
                 }
            }
        } else if (forcePickupAttempt) {
             this.addLogMessage("There is nothing here to pick up.");
        }
    }
}


// Export the class if using modules (adjust based on project setup)
// export default GameEngine;