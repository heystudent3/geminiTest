// Items Module
// Defines the base Item class and specific item types.

class Item {
    constructor(x, y, name, char, color, properties = {}) {
        this.x = x; // Position on the map, null if in inventory
        this.y = y; // Position on the map, null if in inventory
        this.name = name;
        this.char = char; // ASCII representation on map
        this.color = color; // CSS class for color
        this.description = properties.description || "An item.";
        this.type = properties.type || 'generic'; // e.g., 'currency', 'potion', 'weapon', 'armor', 'key'
        this.properties = properties; // For specific effects like healing amount, damage bonus, etc.
    }

    // Method to use the item (e.g., drink potion, equip weapon)
    // This will often be overridden by subclasses or handled based on type.
    use(user) {
        console.log(`${user.name} tries to use ${this.name}, but nothing happens.`);
        // Return value could indicate success, failure, or if the item was consumed.
        return { consumed: false, success: false, message: "Nothing happened." };
    }
}

// --- Specific Item Types ---

class HealingPotion extends Item {
    constructor(x, y, amount = 15) {
        super(x, y, `Health Potion (+${amount})`, '?', 'color-item', {
            description: `A bubbling red potion. Restores ${amount} HP.`,
            type: 'potion',
            healAmount: amount
        });
    }

    use(user) {
        if (user.hp < user.maxHp) {
            const healAmount = this.properties.healAmount;
            user.heal(healAmount);
            return { consumed: true, success: true, message: `You drink the potion and restore ${healAmount} HP.` };
        } else {
            return { consumed: false, success: false, message: "Your health is already full." };
        }
    }
}

class ManaPotion extends Item {
    constructor(x, y, amount = 10) {
        super(x, y, `Mana Potion (+${amount})`, '?', 'color-npc', { // Using cyan color example
            description: `A swirling blue potion. Restores ${amount} MP.`,
            type: 'potion',
            manaAmount: amount
        });
    }

    use(user) {
        if (user.mp < user.maxMp) {
            const manaAmount = this.properties.manaAmount;
            user.restoreMana(manaAmount);
            return { consumed: true, success: true, message: `You drink the potion and restore ${manaAmount} MP.` };
        } else {
            return { consumed: false, success: false, message: "Your mana is already full." };
        }
    }
}

class Gold extends Item {
    constructor(x, y, amount = 1) {
         // Use a specific character for gold pile vs single coin if needed
        super(x, y, `${amount} Gold Coin(s)`, '*', 'color-item', {
            description: `Shiny gold coin(s).`,
            type: 'currency',
            amount: amount
        });
    }

    // Gold is typically collected automatically, not "used" from inventory.
    // The 'use' method might not be relevant here, or could represent dropping it.
    use(user) {
        return { consumed: false, success: false, message: "You can't use gold directly like this." };
    }
}

class BasicSword extends Item {
    constructor(x, y) {
        super(x, y, "Basic Sword", '/', 'color-wall', { // Using '/' as example symbol, gray color
            description: "A simple, somewhat worn sword.",
            type: 'weapon',
            attackBonus: 2
        });
    }

    // Equip logic would go here or be handled by an inventory system
    use(user) {
         // Placeholder for equip action
        console.log(`${user.name} equips the ${this.name}. (Equip logic not implemented)`);
        // In a real system, this would modify user stats and move to an equipment slot.
        return { consumed: false, success: true, message: `You equip the ${this.name}.` };
    }
}

// --- Factory or Helper Function ---
// Could be useful for creating items based on map data or drops
function createItem(type, x, y, properties = {}) {
    switch (type) {
        case 'healing_potion':
            return new HealingPotion(x, y, properties.amount);
        case 'mana_potion':
            return new ManaPotion(x, y, properties.amount);
        case 'gold':
            return new Gold(x, y, properties.amount);
        case 'basic_sword':
            return new BasicSword(x, y);
        // Add other item types
        default:
            console.warn(`Unknown item type requested: ${type}`);
            return new Item(x, y, 'Mysterious Object', '?', 'color-default', { description: 'Its purpose is unclear.' });
    }
}


// Export classes/functions if using modules
// export { Item, HealingPotion, ManaPotion, Gold, BasicSword, createItem };