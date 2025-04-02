module.exports = {
    locations: {
        "forest": {
            description: "You are standing in a forest. There is a path to the north and a dark cave to the east.",
            north: "village",
            east: "cave"
        },
        "village": {
            description: "You are in a small village. The forest is to the south.",
            south: "forest"
        },
        "cave": {
            description: "You are in a dark cave. It is damp and you can hear water dripping. The forest is to the west. There is a shiny gem on the ground. A goblin lurks in the shadows.",
            west: "forest",
            item: "shiny gem",
            enemy: "goblin"
        }
    }
};