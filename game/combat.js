// Handles combat logic between player and enemies

// TODO: Import Player class, potentially enemy definitions

function startCombat(player, enemy) {
    // TODO: Initialize combat state
    console.log(`Combat started between ${player.name} and ${enemy.name || enemy}!`);
    // Return initial combat message/state
    return `You encounter a ${enemy.name || enemy}! What will you do? (Attack, Flee)`;
}

function handleCombatAction(player, enemy, action) {
    // TODO: Process player action (attack, skill, item, flee)
    let playerMessage = "";
    let enemyMessage = "";
    let combatEnded = false;

    if (action === 'attack') {
        // Player attacks enemy
        const playerDamage = Math.max(1, player.stats.attack - (enemy.stats?.defense || 0)); // Basic damage calc
        enemy.stats.hp -= playerDamage;
        playerMessage = `You attack the ${enemy.name || enemy} for ${playerDamage} damage.`;
        if (enemy.stats.hp <= 0) {
            enemyMessage = `The ${enemy.name || enemy} is defeated!`;
            combatEnded = true;
            // TODO: Grant XP, loot, etc.
        }
    } else if (action === 'flee') {
        // TODO: Add chance to flee
        playerMessage = "You attempt to flee...";
        enemyMessage = "You successfully escaped!"; // Simple flee for now
        combatEnded = true;
    } else {
        playerMessage = `Invalid combat action: ${action}. Try 'attack' or 'flee'.`;
    }

    // Enemy attacks player (if not defeated and didn't flee)
    if (!combatEnded && enemy.stats.hp > 0) {
        const enemyDamage = Math.max(1, (enemy.stats?.attack || 1) - player.stats.defense);
        player.takeDamage(enemyDamage); // Use player method
        enemyMessage = `The ${enemy.name || enemy} attacks you for ${enemyDamage} damage. You have ${player.stats.hp}/${player.stats.maxHp} HP.`;
        if (!player.isAlive) {
            enemyMessage += "\nYou have fallen!";
            combatEnded = true;
            // TODO: Handle player death (respawn, game over?)
        }
    }

    // Combine messages and return state
    return {
        message: `${playerMessage}\n${enemyMessage}`.trim(),
        combatEnded: combatEnded,
        playerHp: player.stats.hp,
        enemyHp: enemy.stats?.hp,
    };
}


module.exports = {
    startCombat,
    handleCombatAction,
};