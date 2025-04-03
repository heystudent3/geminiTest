// Game World Module
// Responsible for managing map data, terrain, and potentially procedural generation.

// Define Tile Types (based on reimagined_game_concept.md)
const TILE_TYPES = {
    WALL: { char: '#', color: 'color-wall', solid: true, description: 'Stone Wall' },
    FLOOR: { char: '.', color: 'color-floor', solid: false, description: 'Dirt Floor' },
    WATER: { char: '~', color: 'color-water', solid: true, description: 'Shallow Water' }, // Usually solid unless swimming is implemented
    TREE: { char: 'T', color: 'color-tree', solid: true, description: 'Sturdy Tree' },
    DOOR_CLOSED: { char: '+', color: 'color-door-closed', solid: true, description: 'Closed Door' },
    DOOR_OPEN: { char: '/', color: 'color-door-open', solid: false, description: 'Open Doorway' },
    STAIRS_DOWN: { char: '>', color: 'color-item', solid: false, description: 'Stairs Leading Down' },
    STAIRS_UP: { char: '<', color: 'color-item', solid: false, description: 'Stairs Leading Up' },
    GRASS: { char: '"', color: 'color-tree', solid: false, description: 'Tall Grass' }, // Added example
    EMPTY: { char: ' ', color: 'inherit', solid: true, description: 'Void' } // Represents areas outside the map bounds
};

class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = Array(height).fill(null).map(() => Array(width).fill(TILE_TYPES.FLOOR)); // Default to floor
        this.mapId = 'default_map'; // Identifier for this map area
        this.seed = null; // For procedural generation tracking

        console.log(`World created with dimensions: ${width}x${height}`);
    }

    // --- Map Generation ---
    generateMap(algorithm = 'simple_room') {
        console.log(`Generating map using algorithm: ${algorithm}`);
        // Placeholder for generation logic
        // For now, create a simple room with walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.tiles[y][x] = TILE_TYPES.WALL; // Place walls around the border
                } else {
                    this.tiles[y][x] = TILE_TYPES.FLOOR; // Fill interior with floor
                }
            }
        }
        // Add some example features based on the concept preview
        this.setTile(5, 5, TILE_TYPES.TREE);
        this.setTile(10, 10, TILE_TYPES.WATER);
        this.setTile(15, 8, TILE_TYPES.DOOR_CLOSED);
        this.setTile(3, 12, TILE_TYPES.GRASS);

        // Add stairs example
        this.setTile(this.width - 2, this.height - 2, TILE_TYPES.STAIRS_DOWN);

        console.log("Simple room map generated.");
    }

    // --- Tile Access ---
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TILE_TYPES.EMPTY; // Return void/empty for out-of-bounds
        }
        return this.tiles[y][x];
    }

    setTile(x, y, tileType) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = tileType;
        } else {
            console.warn(`Attempted to set tile outside map bounds at (${x}, ${y})`);
        }
    }

    isSolid(x, y) {
        const tile = this.getTile(x, y);
        return tile.solid;
    }

    // --- Utility ---
    // Add methods for finding starting positions, checking line of sight, etc. later
    getStartingPosition() {
        // Find a suitable starting floor tile
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                if (!this.isSolid(x, y)) {
                    return { x: x, y: y };
                }
            }
        }
        return { x: 1, y: 1 }; // Fallback
    }
}

// Export the class and tile types if using modules
// export { World, TILE_TYPES };