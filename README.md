# Bomberman Clone

A classic Bomberman-style game built with Three.js, featuring pixel art graphics, multiple characters, stages, power-ups, AI enemies, and full gamepad support.

![Bomberman Clone](https://img.shields.io/badge/version-1.0.0-blue)
![Three.js](https://img.shields.io/badge/three.js-r160-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## 🎮 Play Online

**[Play the game here!](https://rrezende88.github.io/bomberman_clone/)**

Test the latest version of the game directly in your browser - no installation required!

## Features

- **4 Playable Characters** - Each with unique stats, HP, and special abilities
- **12 Different Stages** - Diverse themed environments with unique layouts and mechanics
- **Smart AI Enemies** - Three types with different behaviors (Wanderer, Chaser, Patroller)
- **Special Floor Tiles** - Sand floors (slow movement) and Turbo pads (speed boost)
- **Power-up System** - Increase bomb count, blast range, and movement speed
- **Full Gamepad Support** - Native browser Gamepad API integration
- **Pixel Art Graphics** - Retro-style character sprite sheets (16x16px, 3 frames, 4 directions)
- **Chain Reactions** - Bombs trigger other bombs for massive explosions
- **HP System** - Characters have 2-4 HP depending on their type
- **Win Conditions** - Defeat all enemies and reach the exit door

## Technology Stack

- **Three.js (r160)** - 3D graphics library for rendering 2D sprites in orthographic view
- **Vite** - Fast build tool and development server with hot module replacement
- **Native Gamepad API** - Controller support without external libraries
- **Canvas API** - Procedural pixel art generation for tiles and entities
- **Node.js Canvas** - Server-side sprite generation (optional, dev dependency)

## Prerequisites

Before running this game, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (comes with Node.js)
- A modern web browser with:
  - WebGL support
  - Gamepad API support (Chrome, Firefox, Edge, Safari)

## Installation

1. Navigate to the project directory:
```bash
cd bomberman_clone
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

### Development Mode (with hot reload)

Start the development server:
```bash
npm run dev
```

The game will automatically open in your default browser at `http://localhost:3000`

### Production Build

Build the game for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Controls

### Keyboard Controls

| Action | Keys |
|--------|------|
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Move Left | ← or A |
| Move Right | → or D |
| Place Bomb | Space or Enter |
| Pause/Menu | Escape |
| Navigate Menus | Arrow Keys |
| Select Menu Option | Enter or Space |

### Gamepad Controls

| Action | Button |
|--------|--------|
| Move | D-pad or Left Analog Stick |
| Place Bomb | A Button (Xbox) / X Button (PlayStation) |
| Pause/Menu | Start Button |
| Navigate Menus | D-pad |
| Select Menu Option | A Button |

### Gamepad Setup

1. Connect your Xbox, PlayStation, or compatible USB/Bluetooth controller
2. The game will automatically detect the gamepad when connected
3. A "Gamepad Connected!" message will appear on the main menu
4. No additional drivers or configuration needed (works in modern browsers)

**Supported Controllers:**
- Xbox One / Xbox Series X|S controllers
- PlayStation 4 / PlayStation 5 DualShock/DualSense controllers
- Generic USB gamepads with standard button mappings
- Nintendo Switch Pro Controller (via USB or Bluetooth)

## How to Play

### Objective

Eliminate all enemies using bombs, collect power-ups to increase your abilities, avoid explosions, and reach the golden exit door to win!

### Game Elements

**Player (Colored Square with Eyes)**
- Navigate the arena and place bombs strategically
- Avoid getting caught in explosions (lose 1 HP per hit)
- Collect power-ups to become stronger
- Watch out for special floor tiles that affect movement speed

**Enemies**
- **Purple (Wanderer)** - Moves randomly around the arena
- **Red (Chaser)** - Actively pursues the player
- **Cyan (Patroller)** - Follows predetermined patrol routes

**Walls**
- **Gray Brick Walls (#)** - Indestructible hard walls that form the grid pattern
- **Brown Crate Walls (*)** - Destructible soft walls, 30% chance to drop power-ups

**Special Floor Tiles**
- **Sand Floors (S)** - Tan colored, reduces movement speed by 50%
- **Turbo Pads (T)** - Bright colored, increases movement speed by 50%
- Green Bomber and Patroller enemies are immune to slowdown effects

**Bombs**
- 3-second fuse timer before explosion
- Explode in a cross pattern (up, down, left, right)
- Can trigger chain reactions with other bombs

### Power-ups

| Icon | Name | Effect |
|------|------|--------|
| B (Red) | Bomb Up | Increase maximum bomb count by 1 |
| F (Orange) | Fire Up | Increase explosion range by 1 tile |
| S (Blue) | Speed Up | Increase movement speed |

Power-ups spawn from:
- Destroyed soft walls (30% chance)
- Defeated enemies (30% chance)
- Disappear after 10 seconds if not collected

### Characters

Each character has unique starting stats:

1. **Red Bomber** - Balanced (Speed: 2.5, Bombs: 1, HP: 3)
2. **Blue Bomber** - Fast (Speed: 3.0, Bombs: 1, HP: 2) - Glass cannon
3. **Green Bomber** - Bomber (Speed: 2.0, Bombs: 2, HP: 3) - Immune to slowdown effects
4. **Yellow Bomber** - Tank (Speed: 2.0, Bombs: 1, HP: 4) - Most durable

### Stages

The game features 12 unique stages with different themes and layouts:

1. **Classic Arena** - Traditional Bomberman grid layout
2. **Grassland Fields** - Green meadows and fresh air
3. **Desert Dunes** - Hot sandy wasteland with slowdown tiles
4. **Sunny Beach** - Tropical paradise
5. **City Roads** - Urban asphalt jungle with turbo pads
6. **Water World** - Deep blue waters
7. **Dark Forest** - Mysterious woods with dense obstacles
8. **Toxic Zone** - Poisonous hazard area with heavy walls
9. **Frozen Tundra** - Icy cold wasteland
10. **Power Plant** - Industrial energy facility with grouped blocks
11. **Midnight Manor** - Dark night realm with patterned walls
12. **Dungeon Fortress** - Dark dungeon with narrow corridors and central fortress

**Special Tiles:**
- **Sand Floors (S)** - Reduce movement speed by 50% (Desert stage)
- **Turbo Pads (T)** - Increase movement speed by 50% (City Roads stage)
- Some characters are immune to slowdown effects (Green Bomber, Patroller enemies)

### Winning and Losing

**Win Conditions:**
- Eliminate all enemies in the stage
- Golden exit door appears after all enemies defeated
- Reach the exit door to complete the stage

**Lose Conditions:**
- Player loses all HP (varies by character: 2-4 HP)
- Time runs out (180 seconds)

**Scoring:**
- Enemies defeated: Points vary by type
- All enemies cleared: +1000 bonus
- Time remaining: +10 points per second

## Project Structure

```
bomberman_clone/
├── src/
│   ├── main.js                         # Game initialization and main loop
│   ├── data/                           # Game data
│   │   └── stages.js                   # Stage layout definitions (12 stages)
│   ├── entities/                       # Game objects
│   │   ├── Player.js                   # Player character logic
│   │   ├── Enemy.js                    # Enemy AI and behavior
│   │   ├── Bomb.js                     # Bomb mechanics and explosions
│   │   ├── Wall.js                     # Wall types and destruction
│   │   └── Powerup.js                  # Power-up collection
│   ├── parameters/                     # Game configuration
│   │   ├── GameConfig.js               # Game constants and settings
│   │   ├── CharacterBehaviors.js       # Character stats and abilities
│   │   ├── EnemyBehaviors.js           # Enemy types and properties
│   │   └── TileBehaviors.js            # Floor tile properties
│   ├── scenes/                         # Game states
│   │   ├── MainMenuScene.js            # Main menu UI
│   │   ├── CharacterSelectScene.js     # Character selection
│   │   ├── StageSelectScene.js         # Stage selection
│   │   └── GameScene.js                # Main gameplay
│   ├── systems/                        # Game systems
│   │   ├── InputManager.js             # Keyboard + Gamepad input
│   │   ├── CollisionSystem.js          # Collision detection
│   │   ├── ExplosionSystem.js          # Explosion mechanics
│   │   └── AISystem.js                 # Enemy AI coordination
│   └── utils/                          # Utilities
│       ├── SceneManager.js             # Scene transitions
│       ├── SpriteLoader.js             # Texture generation
│       ├── StageLoader.js              # Stage parsing and loading
│       ├── FontLoader.js               # Font loading
│       └── CelebrationAnimation.js     # Victory effects
├── public/
│   └── sprites/                        # Character sprite sheets
│       ├── player_red.png              # Red character (16x48, 4 directions)
│       ├── player_blue.png             # Blue character
│       ├── player_green.png            # Green character
│       └── player_yellow.png           # Yellow character
├── scripts/
│   └── generate-sprites.js             # Node.js script to generate sprites
├── index.html                          # Entry HTML file
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration
└── README.md                           # This file
```

## Development

### Adding New Characters

Edit `src/parameters/CharacterBehaviors.js` and add a new character to the `CHARACTERS` array:

```javascript
{ 
  id: 4, 
  name: 'Purple Bomber', 
  color: 0xff00ff, 
  speed: 2.8, 
  bombs: 1,
  hp: 3,
  immuneToSlowdown: false // Optional special ability
}
```

### Adding New Stages

1. Add stage metadata to `src/parameters/GameConfig.js` in the `STAGES` array:
```javascript
{ 
  id: 12, 
  name: 'Volcano Zone',
  description: 'Fiery volcanic arena',
  theme: 'volcano'
}
```

2. Create stage layout in `src/data/stages.js`:
```javascript
export const STAGE_13 = `#####################
#P..*...*..*....1...#
#.#.#.#.#.#.#.#.#.#.#
#.*....*.*..*...*.**#
#.#.#.#.#.#.#.#.#.#.#
#..*.*...*.*...*.2..#
#.#.#.#.#.#.#.#.#.#.#
#*..*.*..*..*.*.3...#
#.#.#.#.#.#.#.#.#.#.#
#.*..*.*..*..*.*....#
#####################`;
```

3. Add to STAGES array at bottom of `stages.js`:
```javascript
export const STAGES = [
  STAGE_1, STAGE_2, ..., STAGE_13
];
```

**Stage Layout Symbols:**
- `#` = Hard wall (indestructible)
- `*` = Soft wall (destructible, may drop power-ups)
- `.` = Empty space
- `P` = Player spawn point
- `1` = Chaser enemy spawn
- `2` = Wanderer enemy spawn
- `3` = Patroller enemy spawn
- `S` = Sand floor (slowdown)
- `T` = Turbo pad (speed boost)

### Customizing Sprites

**Character Sprites:** Character sprites are pre-generated PNG files located in `public/sprites/`. To regenerate or modify them:

1. Install the canvas dev dependency (if not already installed):
   ```bash
   npm install
   ```
2. Edit `scripts/generate-sprites.js` to modify character appearance (body color, size, animations)
3. Run the sprite generator:
   ```bash
   node scripts/generate-sprites.js
   ```
4. Sprite format: 16x48 PNG (3 frames × 4 directions)
   - Frames: idle, walk1, walk2
   - Directions: down, up, right, left
   - Each character sprite is 16x16px per frame

**Procedural Sprites:** Other game elements are procedurally generated in `src/utils/SpriteLoader.js`:
- `createEnemyTexture()` - Enemy sprites (purple, red, cyan)
- `createBombTexture()` - Bomb appearance (black with countdown)
- `createWallTexture()` - Wall types (gray brick, brown crate)
- `createPowerupTexture()` - Power-up icons (B, F, S)
- `createFloorTexture()` - Special floor tiles (sand, turbo)

**Asset Requirements:**
- Character sprites: 16x16px per frame (16x48 sprite sheet)
- Tile sprites: Generated at 48x48px
- Uses nearest-neighbor filtering for crisp pixel art
- Character PNGs must be placed in `public/sprites/` directory

## Browser Compatibility

| Browser | Version | Gamepad Support |
|---------|---------|-----------------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Safari | 14+ | ⚠️ Limited |
| Opera | 76+ | ✅ Full |

**Note:** Safari has limited gamepad support. Keyboard controls work in all browsers.

## Troubleshooting

### Game doesn't start
- Ensure Node.js v16+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check browser console for errors (F12)

### Gamepad not detected
- Disconnect and reconnect the controller
- Press any button on the gamepad to wake it
- Check browser gamepad support: Visit `chrome://gamepad` (Chrome/Edge)
- Try a different USB port or cable

### Performance issues
- Close other browser tabs
- Disable browser extensions
- Update graphics drivers
- Use production build (`npm run build`) instead of dev mode

### Visual glitches
- Disable browser hardware acceleration
- Clear browser cache
- Update to latest browser version

## Known Limitations

- Single-player only (no network multiplayer)
- Fixed 5 enemies per stage (configurable in `EnemyBehaviors.js`)
- No sound effects or music
- Safari gamepad support is limited
- Stage dimensions fixed at 21×11 grid
- Character sprites must be manually regenerated if modified

## Future Enhancements

Potential features for future versions:
- [ ] Sound effects and background music
- [ ] Local multiplayer (2-4 players)
- [ ] More stages and characters
- [ ] Boss battles
- [ ] Level editor
- [ ] High score leaderboard
- [ ] Mobile touch controls
- [ ] Additional power-up types

## Credits

**Created by:** AI Assistant (Claude)  
**Built with:** Three.js, Vite  
**Inspired by:** Classic Bomberman by Hudson Soft

## License

MIT License - Feel free to modify and distribute

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

**Enjoy the game! 💣💥**
