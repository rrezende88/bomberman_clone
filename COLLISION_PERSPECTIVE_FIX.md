# Collision Perspective Fix - Implementation Summary

## Problem Solved
Fixed the aesthetic collision issue where pixel art characters with visible heads couldn't pass through gaps that appeared visually clear. The centered collision box didn't account for the head/body perspective of the sprites.

## Root Cause
The collision system was using a **centered** collision box, treating the character's head and feet equally for collision detection. With pixel art sprites showing characters with heads and bodies, this caused visual inconsistency - players could see clear space but couldn't move through it.

## Solution Implemented
**Bottom-aligned collision box with vertical offset** - The collision box is now:
1. **Smaller**: 0.5 × TILE_SIZE (reduced from 0.7)
2. **Offset downward**: Shifted 0.15 × TILE_SIZE toward the feet
3. **Allows head overlap**: Top part of the sprite can visually overlap walls

## Changes Made

### 1. src/utils/GameConfig.js

Added collision configuration constants:

```javascript
// Collision (for pixel art perspective)
COLLISION_SIZE_MULTIPLIER: 0.5, // Tighter collision box
COLLISION_OFFSET_Y: 0.15, // Offset down to align with feet
```

**Values Explained:**
- **0.5 multiplier**: Creates a 24px collision box (from 48px tile)
  - Character sprite is 38.4px (0.8 × 48)
  - Collision focuses on body area
  - Better maneuverability through tight spaces

- **0.15 offset**: Shifts box down by 7.2px
  - Aligns collision with character's feet/lower body
  - Allows head to overlap walls by ~30% of collision height
  - Creates natural perspective

### 2. src/systems/CollisionSystem.js

#### Modified `checkCollision()` method (lines 8-27)

**Before:**
```javascript
const entitySize = GameConfig.TILE_SIZE * 0.7;
const entityLeft = x - entitySize / 2;
const entityRight = x + entitySize / 2;
const entityTop = y + entitySize / 2;
const entityBottom = y - entitySize / 2;
```

**After:**
```javascript
const entitySize = GameConfig.TILE_SIZE * GameConfig.COLLISION_SIZE_MULTIPLIER;
const collisionOffsetY = GameConfig.TILE_SIZE * GameConfig.COLLISION_OFFSET_Y;

// Collision box centered horizontally, but offset down vertically
const entityLeft = x - entitySize / 2;
const entityRight = x + entitySize / 2;
const entityTop = (y - collisionOffsetY) + entitySize / 2;
const entityBottom = (y - collisionOffsetY) - entitySize / 2;
```

**Key Changes:**
- Uses configurable size multiplier (0.5)
- Applies vertical offset to top and bottom bounds
- Maintains horizontal centering
- Shifts collision box toward feet

#### Updated boundary checks (lines 19-23)

**Before:**
```javascript
const minBound = entitySize / 2;
const maxBoundX = (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) - entitySize / 2;
const maxBoundY = (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) - entitySize / 2;
```

**After:**
```javascript
const minBoundX = entitySize / 2;
const maxBoundX = (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) - entitySize / 2;
const minBoundY = entitySize / 2 + collisionOffsetY;
const maxBoundY = (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) - entitySize / 2 + collisionOffsetY;
```

**Key Changes:**
- Separate X and Y boundary calculations
- Y bounds account for collision offset
- Prevents characters from clipping out of play area

#### Updated `getTilesOccupiedByEntity()` method (lines 77-93)

**Before:**
```javascript
const positions = [
  { px: x - halfSize, py: y - halfSize },
  { px: x + halfSize, py: y - halfSize },
  { px: x - halfSize, py: y + halfSize },
  { px: x + halfSize, py: y + halfSize },
  { px: x, py: y }
];
```

**After:**
```javascript
const collisionOffsetY = GameConfig.TILE_SIZE * GameConfig.COLLISION_OFFSET_Y;
const offsetY = y - collisionOffsetY;

const positions = [
  { px: x - halfSize, py: offsetY - halfSize },
  { px: x + halfSize, py: offsetY - halfSize },
  { px: x - halfSize, py: offsetY + halfSize },
  { px: x + halfSize, py: offsetY + halfSize },
  { px: x, py: offsetY }
];
```

**Key Changes:**
- Applies same vertical offset as collision check
- Ensures tile occupancy matches actual collision box
- Maintains consistency across collision system

## Visual Representation

### Before (Centered Box)
```
      ┌──────┐
      │ HEAD │  ← Collision checks here
      ├──────┤
      │COLLI-│
      │SION  │
      ├──────┤
      │ FEET │  ← And here equally
      └──────┘
```

### After (Offset Down)
```
      ┌──────┐
      │ HEAD │  ← Can overlap walls!
      ├──────┤
      │      │
      ├──────┤
      │COLLI-│  ← Collision focused here
      │SION  │
      ├──────┤
      │ FEET │
      └──────┘
```

## Benefits

### 1. Natural Movement ✅
- Characters can pass through gaps that look visually clear
- Matches player expectations from visual feedback
- More intuitive gameplay

### 2. Better Gameplay ✅
- Easier navigation through tight corridors
- Tighter collision box improves maneuverability
- Less frustration from "invisible walls"

### 3. Proper Perspective ✅
- Aligns with top-down pixel art conventions
- Feet/body determine collision, not head
- Consistent with how classic Bomberman games feel

### 4. Works for All Entities ✅
- Players use the offset collision
- Enemies use the offset collision
- Consistent behavior across all moving entities

## Testing Checklist

Based on user's test images:

- [x] **Image 1**: Is passing, should pass ✅ (still works)
- [x] **Image 2**: Was NOT passing, should pass ✅ (NOW WORKS - more clearance)
- [x] **Image 3**: Not passing, should not pass ✅ (still blocks)
- [x] **Image 4**: Not passing, should not pass ✅ (still blocks)

### Additional Testing Recommended

1. Navigate through single-tile corridors
2. Walk diagonally near walls
3. Test at different character speeds
4. Verify enemy collision feels consistent
5. Check bomb placement near walls

## Technical Details

### Collision Box Dimensions
- **Original**: 33.6px × 33.6px centered (0.7 × 48)
- **New**: 24px × 24px offset down by 7.2px (0.5 × 48, offset 0.15 × 48)

### Effective Collision Area
- **Width**: 24px (50% of tile)
- **Height**: 24px (50% of tile)
- **Vertical Position**: Lower 50% of sprite + 15% offset
- **Head Clearance**: ~30% of sprite height can overlap

### Performance Impact
- **Negligible**: Same number of collision checks
- **Slightly better**: Smaller collision box = faster AABB tests
- **No additional overhead**: Offset is simple arithmetic

## Tuning Parameters

If the collision feels too loose or too tight, adjust these values in `GameConfig.js`:

```javascript
// Make collision tighter/looser
COLLISION_SIZE_MULTIPLIER: 0.5, // Try 0.4-0.6

// Adjust vertical offset
COLLISION_OFFSET_Y: 0.15, // Try 0.1-0.2
```

**Recommended ranges:**
- Size: 0.4 (very tight) to 0.6 (looser)
- Offset: 0.1 (slight shift) to 0.2 (more head clearance)

## Files Modified
- `src/utils/GameConfig.js` - Added collision constants
- `src/systems/CollisionSystem.js` - Applied offset collision logic
- `COLLISION_PERSPECTIVE_FIX.md` - This documentation

## Comparison Summary

| Aspect | Before | After |
|--------|--------|-------|
| Collision Box | Centered | Offset down |
| Size | 70% of tile | 50% of tile |
| Head Overlap | None | ~30% clearance |
| Tight Spaces | Difficult | Easy |
| Visual Match | Poor | Good |

The fix makes the collision system match what players see, creating a more natural and enjoyable gameplay experience! 🎮
