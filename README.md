# Bomberman Clone

A classic Bomberman-style game built with Three.js, featuring pixel art graphics, multiple characters, stages, power-ups, AI enemies, and full gamepad support.

![Bomberman Clone](https://img.shields.io/badge/version-1.0.0-blue)
![Three.js](https://img.shields.io/badge/three.js-r160-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## 🎮 Play Online

**[Play the game here!](https://rrezende88.github.io/bomberman_clone/)**

Test the latest version of the game directly in your browser - no installation required!

## Features

- **4 Playable Characters** - Each with unique stats and abilities
- **2 Different Stages** - Classic Arena and Central Fortress
- **Smart AI Enemies** - Three types with different behaviors (Wanderer, Chaser, Patroller)
- **Power-up System** - Increase bomb count, blast range, and movement speed
- **Full Gamepad Support** - Native browser Gamepad API integration
- **Pixel Art Graphics** - Retro-style procedurally generated sprites
- **Chain Reactions** - Bombs trigger other bombs for massive explosions
- **Win Conditions** - Defeat all enemies and reach the exit door

## Technology Stack

- **Three.js** - 3D graphics library for rendering 2D sprites
- **Vite** - Fast build tool and development server
- **Native Gamepad API** - Controller support without external libraries
- **Canvas API** - Procedural pixel art generation

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
- Avoid getting caught in explosions
- Collect power-ups to become stronger

**Enemies**
- **Purple (Wanderer)** - Moves randomly around the arena
- **Red (Chaser)** - Actively pursues the player
- **Cyan (Patroller)** - Follows predetermined patrol routes

**Walls**
- **Gray Brick Walls** - Indestructible obstacles
- **Brown Crate Walls** - Destructible, may contain power-ups

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

1. **Red Bomber** - Balanced (Speed: 2.5, Bombs: 1)
2. **Blue Bomber** - Fast (Speed: 3.0, Bombs: 1)
3. **Green Bomber** - Bomber (Speed: 2.0, Bombs: 2)
4. **Yellow Bomber** - Balanced (Speed: 2.5, Bombs: 1)

### Stages

**Classic Arena**
- Traditional Bomberman grid layout
- Regular pattern of indestructible walls
- Moderate amount of destructible walls

**Central Fortress**
- Large fortress structure in the center
- Corner obstacles for strategic positioning
- More open space for movement

### Winning and Losing

**Win Conditions:**
- Eliminate all enemies in the stage
- Golden exit door appears after all enemies defeated
- Reach the exit door to complete the stage

**Lose Conditions:**
- Player loses all lives (3 lives total)
- Time runs out (180 seconds)

**Scoring:**
- Enemies defeated: Points vary by type
- All enemies cleared: +1000 bonus
- Time remaining: +10 points per second

## Project Structure

```
bomberman_clone/
├── src/
│   ├── main.js                      # Game initialization and main loop
│   ├── entities/                    # Game objects
│   │   ├── Player.js               # Player character logic
│   │   ├── Enemy.js                # Enemy AI and behavior
│   │   ├── Bomb.js                 # Bomb mechanics and explosions
│   │   ├── Wall.js                 # Wall types and destruction
│   │   └── Powerup.js              # Power-up collection
│   ├── scenes/                      # Game states
│   │   ├── MainMenuScene.js        # Main menu UI
│   │   ├── CharacterSelectScene.js # Character selection
│   │   ├── StageSelectScene.js     # Stage selection
│   │   └── GameScene.js            # Main gameplay
│   ├── systems/                     # Game systems
│   │   ├── InputManager.js         # Keyboard + Gamepad input
│   │   ├── CollisionSystem.js      # Collision detection
│   │   ├── ExplosionSystem.js      # Explosion mechanics
│   │   └── AISystem.js             # Enemy AI coordination
│   └── utils/                       # Utilities
│       ├── GameConfig.js           # Game constants
│       ├── SceneManager.js         # Scene transitions
│       └── SpriteLoader.js         # Texture generation
├── index.html                       # Entry HTML file
├── package.json                     # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── README.md                        # This file
```

## Development

### Adding New Characters

Edit `src/utils/GameConfig.js` and add a new character to the `CHARACTERS` array:

```javascript
{ 
  id: 4, 
  name: 'Purple Bomber', 
  color: 0xff00ff, 
  speed: 2.8, 
  bombs: 1 
}
```

### Adding New Stages

1. Add stage metadata to `GameConfig.STAGES`
2. Create a new generation function in `GameScene.js`
3. Call it from `generateStage()` based on stage ID

### Customizing Sprites

All sprites are procedurally generated in `src/utils/SpriteLoader.js`. Modify the Canvas drawing code to change appearance:

- `createCharacterTexture()` - Player and character sprites
- `createEnemyTexture()` - Enemy sprites
- `createBombTexture()` - Bomb appearance
- `createWallTexture()` - Wall types
- `createPowerupTexture()` - Power-up icons

### Asset Requirements

If replacing procedural sprites with actual image files:
- Character sprites: 16x16px or 32x32px PNG
- Tile sprites: 32x32px PNG
- Use nearest-neighbor filtering for crisp pixels
- Place in `src/assets/` directory structure

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
- Maximum 5 enemies per stage
- No sound effects or music (can be added)
- Safari gamepad support is limited

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
