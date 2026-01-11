/**
 * TileBehaviors - Defines behavior and properties for environment tiles
 * Maps tile characters to their gameplay properties
 */

/**
 * Tile behavior configuration
 * Each key is a character used in stage files
 * Each value defines the tile's properties:
 *   - type: string identifier for the tile type
 *   - collision: whether entities collide with this tile
 *   - destructible: whether explosions can destroy this tile
 *   - speedModifier: optional additive speed modifier (effectiveSpeed = baseSpeed * (1 + modifier))
 *     - Negative values slow down (e.g., -0.5 = 50% speed)
 *     - Positive values speed up (e.g., 0.5 = 150% speed)
 *   - description: human-readable description
 */
const TILE_BEHAVIORS = {
  '#': {
    type: 'hardWall',
    collision: true,
    destructible: false,
    description: 'Hard wall (indestructible)'
  },
  
  '*': {
    type: 'softWall',
    collision: true,
    destructible: true,
    description: 'Soft wall (destructible)'
  },
  
  '.': {
    type: 'empty',
    collision: false,
    destructible: false,
    description: 'Empty space (walkable)'
  },
  
  'S': {
    type: 'sandFloor',
    collision: false,
    destructible: false,
    speedModifier: -0.5,
    description: 'Sand floor (reduces movement speed)'
  },
  
  'T': {
    type: 'turboFloor',
    collision: false,
    destructible: false,
    speedModifier: 0.5,
    description: 'Turbo pad (increases movement speed)'
  }
};

export default TILE_BEHAVIORS;
