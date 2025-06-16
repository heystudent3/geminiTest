import { ACHIEVEMENTS } from './achievements.js';

// Player Module
// Represents the player character in the game.

class Player {
    constructor(x, y, name = "Adventurer") {
        this.x = x;
        this.y = y;
        this.name = name;
        this.char = '@'; // Standard player symbol
        this.color = 'color-player'; // Defined in styles.css

        // Core Stats (based on concept)
        this.hp = 30;
        this.maxHp = 30;
        this.mp = 10;
        this.maxMp = 10;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100; // Example value

        // Combat/Derived Stats (placeholders)
        this.strength = 5;
        this.dexterity = 5;
        this.intelligence = 5;
        this.attackPower = this.strength; // Simple calculation for now
        this.defense = 0;

        // Inventory & Skills (placeholders)
        this.inventory = []; // Array of Item objects
        this.skills = []; // Array of Skill objects
        this.inventoryLimit = 10;

        // Achievement Tracking
        this.achievementsEarned = []; // Stores IDs of earned achievements
        this.enemiesKilled = 0;
        this.itemsPickedUp = 0;

        console.log(`Player "${this.name}" created at (${this.x}, ${this.y})`);
    }

    // --- Movement ---
    move(dx, dy, world) {
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Check world boundaries and tile solidity
        if (!world.isSolid(newX, newY)) {
            this.x = newX;
            this.y = newY;
            console.log(`Player moved to (${this.x}, ${this.y})`);
            return true; // Movement successful
        } else {
            const blockingTile = world.getTile(newX, newY);
            console.log(`Movement blocked by ${blockingTile.description} at (${newX}, ${newY})`);
            // Potentially trigger interaction if it's a door, NPC, etc.
            // this.interactWith(blockingTile, newX, newY, world);
            return false; // Movement blocked
        }
    }

    // --- Combat ---
    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.defense); // Factor in defense
        this.hp -= actualDamage;
        console.log(`${this.name} took ${actualDamage} damage. HP: ${this.hp}/${this.maxHp}`);
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        console.log(`${this.name} healed ${amount} HP. HP: ${this.hp}/${this.maxHp}`);
    }

    useMana(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            console.log(`${this.name} used ${amount} MP. MP: ${this.mp}/${this.maxMp}`);
            return true;
        }
        console.log(`${this.name} has insufficient MP.`);
        return false;
    }

    restoreMana(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
        console.log(`${this.name} restored ${amount} MP. MP: ${this.mp}/${this.maxMp}`);
    }

    // --- Progression ---
    gainXP(amount, engine) {
        this.xp += amount;
        engine.addLogMessage(`${this.name} gained ${amount} XP. Total XP: ${this.xp}/${this.xpToNextLevel}`);
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp(engine);
        }
    }

    levelUp(engine) {
        this.level++;
        this.xp -= this.xpToNextLevel; // Subtract threshold XP
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5); // Increase XP needed for next level

        // Improve stats on level up (example)
        this.maxHp += 5;
        this.maxMp += 2;
        this.strength += 1;
        this.dexterity += 1;
        this.intelligence += 1;

        // Full heal on level up
        this.hp = this.maxHp;
        this.mp = this.maxMp;

        engine.addLogMessage(`${this.name} reached Level ${this.level}! Stats increased. HP/MP restored.`);
        this.checkAchievements(engine);
    }

    // --- Stat Incrementer for Achievements ---
    incrementStat(statName, amount = 1, engine) {
        if (typeof this[statName] === 'number') {
            this[statName] += amount;
            this.checkAchievements(engine);
        } else {
            console.warn(`Attempted to increment non-numeric stat: ${statName}`);
        }
    }

    // --- Achievement System ---
    checkAchievements(engine) {
        for (const achievementId in ACHIEVEMENTS) {
            const achievement = ACHIEVEMENTS[achievementId];
            if (!this.achievementsEarned.includes(achievement.id)) {
                let criteriaMet = false;

                switch (achievement.criteria.type) {
                    case 'playerLevel':
                        criteriaMet = this.level >= achievement.criteria.targetValue;
                        break;
                    case 'enemiesKilled':
                        criteriaMet = this.enemiesKilled >= achievement.criteria.targetValue;
                        break;
                    case 'itemsPickedUp':
                        criteriaMet = this.itemsPickedUp >= achievement.criteria.targetValue;
                        break;
                    // Add more criteria types as needed
                }

                if (criteriaMet) {
                    this.achievementsEarned.push(achievement.id);
                    engine.addLogMessage(`ACHIEVEMENT UNLOCKED: ${achievement.name} - ${achievement.description}`);
                    // Apply reward
                    if (achievement.reward) {
                        switch (achievement.reward.type) {
                            case 'xp':
                                this.gainXP(achievement.reward.amount, engine); // Recursively call gainXP
                                engine.addLogMessage(`Received ${achievement.reward.amount} XP as reward.`);
                                break;
                            // Add other reward types (e.g., gold, items, stats)
                        }
                    }
                    // Potentially trigger a visual notification in the engine/client
                }
            }
        }
    }

    // --- Inventory ---
    addItem(item) {
        if (this.inventory.length < this.inventoryLimit) {
            this.inventory.push(item);
            console.log(`${this.name} picked up ${item.name}.`);
            return true;
        } else {
            console.log(`${this.name}'s inventory is full.`);
            return false;
        }
    }

    removeItem(itemToRemove) {
        this.inventory = this.inventory.filter(item => item !== itemToRemove);
        console.log(`${this.name} removed ${itemToRemove.name}.`);
    }

    // --- State ---
    die() {
        console.error(`${this.name} has died! Game Over (or respawn logic needed).`);
        // Trigger game over state in the engine
    }

    // --- Utility ---
    getPosition() {
        return { x: this.x, y: this.y };
    }
}

// Export the class if using modules
// export default Player;