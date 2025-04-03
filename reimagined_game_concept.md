# Reimagined ASCII RPG Concept - Detailed

## Core Concept

*   **Vision:** Create a compelling 2D RPG experience using only ASCII characters for all in-game visuals (player, enemies, items, terrain). The game runs within a dedicated, stylized "fake console" element centered on a modern web page.
*   **Gameplay Focus:** Prioritize non-linear exploration of potentially vast, procedurally generated worlds. Emphasis on discovering secrets, engaging in tactical combat, and developing a unique character through leveling and skills. Story elements are minimal, focusing on environmental storytelling and emergent player narratives.
*   **Target Aesthetic:** Blend retro terminal aesthetics (ASCII art, monospace fonts, limited color palette within the console) with modern web design for the surrounding interface (smooth animations for UI elements outside the console, rounded corners, clean layout).

## Gameplay Loop - Detailed Steps

1.  **Start Menu:**
    *   Displayed within the fake console upon loading the webpage.
    *   Uses ASCII characters for menu options (e.g., `[ New Character ]`, `[ Load Character ]`).
    *   Navigation via arrow keys and Enter, or potentially clickable ASCII buttons.
    *   Visual feedback: Highlighted option might change color or have surrounding brackets change (e.g., `< New Character >`).
2.  **Character Creation:**
    *   Simple, text-based interface within the console.
    *   **Name Input:** Text field for player name.
    *   **Starting Archetype (Optional):** Choose from 2-3 basic archetypes (e.g., Warrior `[W]`, Ranger `[R]`, Mage `[M]`) which might grant starting stat bonuses or a unique initial skill. Represented by distinct ASCII symbols.
    *   **Confirmation:** Review choices and confirm (`[ Begin Adventure ]`).
    *   Data saved to PostgreSQL via backend API call.
3.  **Enter World:**
    *   Transition effect (e.g., console clears, "Connecting..." message, then fades in the game map).
    *   Player character (`@` or other distinct symbol) appears at a predefined starting point on the initial map (e.g., a small village, a clearing).
    *   Initial view shows the player and the immediate surroundings within the console's viewport.
4.  **Exploration:**
    *   **Controls:** WASD or Arrow Keys for cardinal direction movement. Diagonal movement might be possible.
    *   **Map Representation:** The world is a grid. Terrain features use different ASCII characters and colors (e.g., `.` for floor, `#` for walls, `T` for trees with green color, `~` for water with blue color).
    *   **Scrolling:** As the player moves, the map view within the console scrolls smoothly, keeping the player character generally centered.
    *   **Fog of War (Optional):** Unexplored areas might be hidden or obscured until visited.
5.  **Interaction:**
    *   **Movement-Based:** Interaction typically occurs by moving the player character (`@`) onto the same tile as an interactable object/character.
    *   **Enemies (`E`, `G`, `S`, etc.):** Different letters/symbols for different enemy types. Moving onto their tile initiates combat. Some enemies might be aggressive and move towards the player if they enter a line of sight.
    *   **Treasures (`*`, `$`, `?`):** Moving onto the tile automatically collects the item. A message appears in a log area (e.g., "Found 10 gold!", "Picked up a Health Potion."). Represented by distinct symbols and colors (e.g., yellow for gold `*`, red for potion `?`).
    *   **NPCs (`N`, `V`, `M`):** Moving onto their tile might open a simple dialogue box within the console. Dialogue choices selected via number keys or arrow keys. (Lower priority feature).
    *   **Environment:** Doors (`+`, `/`), levers (`!`), chests (`C`). Moving onto them might trigger an action (opening, pulling, requiring a key).
6.  **Combat:**
    *   **Initiation:** Screen might flash, transition to a dedicated combat layout within the console, or combat might happen directly on the map.
    *   **System:** Likely turn-based for simplicity. Player acts, then enemies act.
    *   **Interface:** Display player HP/MP, enemy HP, available actions/skills (e.g., `[A]ttack`, `[S]kill`, `[I]tem`, `[F]lee`).
    *   **Actions:** Select action via key press. Attacks involve simple "hit/miss" calculations based on stats. Skills have varied effects (damage, buffs, debuffs) represented by ASCII effects (e.g., a flurry of `*` for a magic missile).
    *   **Resolution:** Defeating all enemies grants XP and potential loot drops. Fleeing might have a chance of success based on stats. Player death could mean returning to a starting point with penalties (XP loss, gold loss).
7.  **Progression:**
    *   **Experience (XP):** Tracked via a bar or numerical value, possibly displayed subtly on the main game UI.
    *   **Level Up:** Upon reaching XP threshold, a notification appears (`Level Up!`). Player might be prompted to allocate stat points (e.g., +1 Strength, +1 Agility) via a simple menu.
    *   **Skills:** New skills might unlock automatically at certain levels, or players might spend skill points in a simple tree accessed via a menu (`[K] Skills`).
    *   **Saving:** Progress (level, stats, skills, inventory, current map location) is saved automatically at key points (level up, map transition) or manually via an option, sending data to the backend/Postgres.
8.  **Map Transitions:**
    *   Reaching the edge of the current map area triggers loading of the adjacent map section.
    *   Using specific environmental features like portals (`O`) or stairs (`<`, `>`) instantly loads a different map (e.g., entering a dungeon, moving between floors).
    *   Loading screen within the console shows "Loading Area..." or similar. Map data might be generated procedurally on demand or fetched if pre-generated/cached.

## Key Features - Detailed

*   **ASCII Visuals:**
    *   **Character Set:** Extended ASCII or Unicode block characters for more variety (e.g., box drawing characters `│ ─ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`, block elements `░ ▒ ▓`).
    *   **Color:** Use ANSI-like color codes (mapped to CSS classes/styles) for differentiation (e.g., player in white, enemies in red, terrain in greens/browns, items in yellow/cyan).
    *   **Animation:** Simple frame-based animation by cycling characters/colors (e.g., water `~` alternating with `≈`, flickering torches `*`). Movement is grid-based tile-to-tile updates.
*   **Fake Console UI:**
    *   **Layout:** A fixed-size grid (e.g., 80x25 characters) rendered using `<pre>` or a CSS Grid of `<span>` elements.
    *   **Border:** Styled using CSS `border` property, potentially with box-drawing characters or a CSS gradient to mimic CRT curvature. Rounded corners via `border-radius`.
    *   **Internal Panes:** May be divided into sections: main map view, message log area, player status (HP/MP/Level).
    *   **Effects:** Subtle CSS animations for scanlines, flickering, or a slight glow effect to enhance the terminal feel.
*   **Modern Frontend Design (Outside Console):**
    *   **Page Background:** Clean, possibly dark theme that contrasts with the console. Could be a solid color, subtle gradient, or abstract background image.
    *   **Typography:** Use a modern, readable sans-serif font for any text outside the console (e.g., page title, footer links).
    *   **Responsiveness:** The central console maintains its aspect ratio but might scale down slightly on smaller screens. The surrounding page elements reflow cleanly.
*   **Procedural Maps:**
    *   **Algorithms:** Use algorithms like Cellular Automata, Perlin Noise, or Drunkard's Walk to generate terrain features (caves, forests, open areas).
    *   **Biomes:** Generate different map types with distinct character sets, color palettes, and enemy/item distributions (e.g., Forest: `T`, `♣`; Dungeon: `#`, `+`; Cave: `▒`, `▓`).
    *   **Connectivity:** Ensure generated maps connect logically via edges or defined transition points (stairs, portals).
    *   **Persistence:** Store the seed and key parameters used for generation in Postgres, allowing regeneration of the same map later. Or, store the fully generated map layout if needed (might exceed free tier limits quickly).
*   **Character System:**
    *   **Stats:** Core stats like Health Points (HP), Mana/Energy Points (MP), Strength (physical damage), Dexterity (accuracy/evasion), Intelligence (magic damage/MP).
    *   **Leveling:** Exponential XP curve. Stat increases per level.
    *   **Skills:** Mix of passive (e.g., +10% HP) and active skills (e.g., Fireball, Quick Strike). Active skills consume MP. Skill tree allows specialization.
    *   **Inventory:** Simple list-based inventory. Items represented by ASCII (`P` for potion, `S` for sword). Limited slots. Equipment might provide stat bonuses (handled simply).
*   **Persistence:**
    *   **Data:** Player profile (name, class, level, XP, stats, learned skills), inventory contents, current map ID/seed, player coordinates on that map.
    *   **Mechanism:** API endpoints on the Node.js backend (`/api/save`, `/api/load`). Frontend sends JSON data. Backend validates and updates/retrieves from PostgreSQL.
    *   **Frequency:** Autosave on significant events (level up, map change, quest completion) and potentially a manual save option. Consider rate limiting to respect free tier database constraints.

## Map Preview Example

This is a small example of how a section of a map might look within the fake console. Colors would be applied via CSS.

```
#####################################
#.........T.....~~~~~...............#
#..@......T....~~~~~...G............#
#.........T....~~~~~................#
#....C....T.........................#
#...................*...............#
#.........#####.....................#
#.........#...#.....S...............#
#.........#...#.....................#
#.........#+..#.....................#
#.........#####?....................#
#...................................#
#####################################

Key:
# : Wall (Stone)
. : Floor (Dirt/Stone)
T : Tree
~ : Water
@ : Player
G : Goblin (Enemy)
S : Skeleton (Enemy)
C : Chest
* : Gold Coin (Item)
? : Potion (Item)
+ : Door
```

## Technical Stack & Hosting - Detailed

*   **Frontend (Netlify):**
    *   **HTML:** Semantic structure (`<main>`, `<aside>`, `<pre>`).
    *   **CSS:** Styling for the page, the fake console container, ASCII character colors/backgrounds (using classes), layout (Flexbox/Grid), subtle animations/effects.
    *   **JavaScript:** Core game engine (state management, game loop, input handling), rendering logic (updating characters/colors in the DOM grid), procedural generation (if client-side), API calls (`fetch`) to backend. Consider a simple framework/library (like Rot.js for roguelikes) or vanilla JS.
*   **Backend (Render):**
    *   **Node.js:** Using Express.js or similar framework for routing API requests.
    *   **API:** RESTful endpoints for `load`, `save`, potentially `generateMap` if server-side.
    *   **Database Interaction:** Use a PostgreSQL client library (e.g., `pg` or an ORM like Sequelize/TypeORM) to interact with the Render database.
*   **Database (Render PostgreSQL - Free Tier):**
    *   **Schema:** Tables for `players` (id, name, level, xp, stats_json, skills_json, inventory_json, current_map_id, pos_x, pos_y), potentially `maps` (id, seed, biome_type, generated_layout_json - *caution with size*).
    *   **Constraints:** Be mindful of storage limits, connection limits, and potential inactivity shutdowns on the free tier. Design data structures efficiently.
*   **Hosting Considerations:**
    *   **API Calls:** Minimize frequency and data size of API calls between Netlify frontend and Render backend.
    *   **Cold Starts:** Be aware of potential delays when the Render free tier backend/database wakes up from inactivity. Provide user feedback during loading.

## Design Considerations - Detailed

*   **Readability:**
    *   **Font:** Use a clear, fixed-width font (like 'Courier New', 'Consolas', or a custom webfont) within the console. Ensure sufficient `line-height` and `letter-spacing`.
    *   **Color Contrast:** Adhere to accessibility guidelines (WCAG AA) for text/background color contrast within the console, even with a limited palette. Test different color combinations.
    *   **Symbol Choice:** Select ASCII characters that are easily distinguishable and intuitively represent their object (e.g., `@` for player is standard, `#` for walls). Avoid overly complex or ambiguous symbols.
*   **Performance:**
    *   **DOM Updates:** Instead of regenerating the entire console grid each frame, only update the specific characters/styles that have changed. Use `requestAnimationFrame` for the game loop.
    *   **Throttling:** Throttle frequent updates (like player movement rendering) if needed.
    *   **Data Structures:** Use efficient JavaScript data structures (e.g., Maps, Sets) for managing game state.
*   **Responsiveness:**
    *   **Console Scaling:** Use CSS `transform: scale()` or adjust font size based on viewport width to make the console slightly responsive while maintaining aspect ratio. Ensure it remains centered.
    *   **Mobile:** While playable, a keyboard is ideal. Consider basic touch controls (on-screen buttons or swipe gestures) as a secondary input method if targeting mobile.
*   **Consistency:**
    *   **Visual Language:** The retro terminal style should be consistent *within* the console. The modern style should be consistent *outside* the console. Avoid mixing styles jarringly.
    *   **Interaction Model:** Interactions should feel cohesive (mostly movement-based, consistent menu navigation).