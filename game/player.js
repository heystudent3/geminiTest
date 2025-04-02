// Defines the Player character class

class Player {
    constructor(name = "Hero") {
        this.name = name;
        this.level = 1;
        this.xp = 0;
        this.stats = {
            hp: 10,
            maxHp: 10,
            attack: 1,
            defense: 0,
        };
        this.inventory = []; // Holds item objects/ids
        this.equipment = {
            weapon: null, // Holds item object/id
            armor: null,  // Holds item object/id
        };
        this.locationId = 'town_square'; // Starting location ID
        this.skills = []; // TODO: Implement later
        this.achievements = []; // TODO: Implement later
        this.isAlive = true;
    }

    // Example method (more will be added later)
    addItem(item) {
        this.inventory.push(item);
        console.log(`${this.name} picked up ${item.name || item}`);
    }

    // Example method
    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.stats.defense); // Basic defense calculation
        this.stats.hp -= actualDamage;
        console.log(`${this.name} took ${actualDamage} damage.`);
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.isAlive = false;
            console.log(`${this.name} has died.`);
        }
    }

    // TODO: Add methods for equipping items, calculating stats based on equipment, leveling up, using skills, etc.
}

module.exports = Player;