# Stage Format Documentation

## Overview

Stages use a simple text-based format to define level layouts for the Bomberman clone. Each character represents a different tile type or entity spawn point.

## File Format

- **Location**: `src/data/stages.js`
- **Format**: JavaScript string constants
- **Dimensions**: Must be exactly **21 columns × 11 rows**
- **Encoding**: UTF-8

## Symbol Reference

| Symbol | Type | Description |
|--------|------|-------------|
| `#` | Hard Wall | Indestructible wall, forms arena boundaries and obstacles |
| `*` | Soft Wall | Destructible wall, can be blown up by bombs |
| `.` | Empty Space | Walkable area, no obstacles |
| `P` | Player Spawn | Starting position for the player character |
| `1` or `E` | Enemy (Chaser) | Chaser-type enemy - actively pursues the player |
| `2` | Enemy (Wanderer) | Wanderer-type enemy - moves randomly |
| `3` | Enemy (Patroller) | Patroller-type enemy - follows a set patrol route |

## Stage Layout Rules

### Dimensions
- Every stage must be **exactly 21 characters wide** and **11 lines tall**
- Each line represents a row in the game grid (Y-axis)
- Each character represents a column (X-axis)

### Border Requirements
- The outer edge (first and last row/column) should typically be hard walls (`#`)
- This prevents players and enemies from leaving the arena

### Player Spawn
- **Required**: Every stage must have exactly one `P` (player spawn point)
- **Location**: Typically placed in the top-left area `(1, 1)` for consistency
- **Safety**: Ensure 2-3 empty spaces around the spawn for player safety

### Enemy Spawns
- **Optional**: Stages can have 0-10 enemy spawn points
- **Types**: Use `1`, `2`, or `3` to specify enemy behavior
  - `1` or `E`: Chaser (aggressive, follows player)
  - `2`: Wanderer (random movement)
  - `3`: Patroller (fixed route)
- **Placement**: Avoid placing enemies near player spawn

### Wall Placement
- **Hard Walls (`#`)**: Use for permanent obstacles and grid structure
  - Classic pattern: Every even column/row intersection `(x%2==0, y%2==0)`
  - Cannot be destroyed by bombs
  
- **Soft Walls (`*`)**: Use for destructible obstacles
  - Create strategic chokepoints and hiding spots
  - May drop power-ups when destroyed (30% chance)
  - Provide cover and tactical depth

### Empty Spaces (`.`)
- Allow player and enemy movement
- Required for gameplay flow
- Too many = too easy, too few = claustrophobic

## Example Stages

### Example 1: Classic Arena (STAGE_1)

```
#####################
#P..*.*..*..*...1..#
#.#.#.#.#.#.#.#.#.#.#
#.*....*.*..*...*.*#
#.#.#.#.#.#.#.#.#.#.#
#..*.*...*.*...*.*.#
#.#.#.#.#.#.#.#.#.#.#
#*..*.*.2.*..*.*...#
#.#.#.#.#.#.#.#.#.#.#
#.*..*.*..*..*.*...#
#####################
```

**Features:**
- Traditional grid pattern with alternating hard walls
- Balanced soft wall distribution
- Multiple enemy types positioned strategically
- Open spaces for tactical movement

### Example 2: Dungeon Fortress (STAGE_12)

```
#####################
#P................1.#
#*#*#**#########*#*##
#.*..*.........*..*.#
#*#*#*..#####..*#*#*#
#......*#...#*......#
#*####*##.3.##*####*#
#......*#...#*......#
#*#*#*..#####..*#*#*#
#.*..*.........*..*.#
#####################
```

**Features:**
- Central fortress structure
- Narrow corridors for intense gameplay
- Asymmetric layout for variety
- Patroller enemy in central room

## Design Tips

### Balance
- **Open Areas**: 30-40% of the stage should be open space
- **Soft Walls**: 20-30% for destructible cover
- **Hard Walls**: 30-40% for permanent structure

### Difficulty Progression
- **Easy Stages**: Wide corridors, few enemies, lots of escape routes
- **Medium Stages**: Balanced layout, 3-5 enemies, some chokepoints
- **Hard Stages**: Narrow paths, 5-8 enemies, limited movement options

### Visual Appeal
- Create symmetry or interesting asymmetric patterns
- Use hard walls to form recognizable shapes (crosses, diamonds, etc.)
- Vary soft wall density to create distinct zones

### Gameplay Considerations
- **Escape Routes**: Always provide multiple paths to avoid traps
- **Power-Up Distribution**: Soft walls drop power-ups - place them strategically
- **Enemy Placement**: Spread enemies across the map, not all in one area
- **Dead Ends**: Use sparingly - can create camping spots or death traps

## Testing Checklist

Before finalizing a stage, verify:

- [ ] Exactly 21 characters wide × 11 rows tall
- [ ] One and only one player spawn (`P`)
- [ ] Border is enclosed with hard walls
- [ ] Player spawn has 2-3 empty adjacent tiles
- [ ] Enemies are not placed next to player spawn
- [ ] At least 2-3 clear paths from spawn to other areas
- [ ] No unreachable areas (islands)
- [ ] Balanced mix of open space and obstacles

## Technical Notes

### Loading Process
1. Stage files are loaded via `StageLoader.js`
2. Parser ignores comment lines (`//`)
3. Each character is converted to game entities
4. Invalid stages fall back to default procedural generation

### Performance
- Stage files are cached after first load
- Large stages (beyond 21×11) may impact performance
- Keep file size under 2KB for optimal loading

## Common Mistakes

❌ **Wrong dimensions**: Not exactly 21×11
```
################  // Only 16 wide - too narrow!
```

❌ **Multiple player spawns**: More than one `P`
```
#P........P#  // Error: Two player spawns
```

❌ **No player spawn**: Missing `P` entirely
```
############  // Error: Where does player start?
```

❌ **Open borders**: Missing walls on edges
```
#.................#  // Error: Player can walk off edge
```

❌ **Enemy near spawn**: Enemy too close to player
```
#P1.....#  // Bad: Enemy right next to spawn
```

## Version History

- **v1.1** (2026-01-10): Updated grid dimensions
  - 21×11 grid dimensions (dedicated HUD row above game area)
  - 7 entity types supported
  - Comment support
  
- **v1.0** (2026-01-10): Initial format specification
  - 21×12 grid dimensions
  - 7 entity types supported
  - Comment support

---

**Need Help?** Check existing stage definitions in `src/data/stages.js` for working examples.
