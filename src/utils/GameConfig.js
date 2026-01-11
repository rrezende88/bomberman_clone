// Game configuration constants
export const GameConfig = {
  // Grid settings
  GRID_WIDTH: 21,
  GRID_HEIGHT: 11,
  TILE_SIZE: 48,
  
  // Player settings
  PLAYER_SPEED: 2.5,
  PLAYER_LIVES: 3,
  PLAYER_MAX_BOMBS: 1,
  PLAYER_BOMB_RANGE: 1,
  
  // Bomb settings
  BOMB_FUSE_TIME: 3000, // milliseconds
  EXPLOSION_DURATION: 500,
  
  // Power-up settings
  POWERUP_LIFETIME: 10000,
  POWERUP_DROP_CHANCE: 0.3,
  
  // Enemy settings
  ENEMY_SPEED: 1.5,
  ENEMY_COUNT: 5,
  
  // Game timer
  GAME_TIME: 180, // seconds
  
  // Characters
  CHARACTERS: [
    { id: 0, name: 'Red Bomber', color: 0xff3333, speed: 2.5, bombs: 1 },
    { id: 1, name: 'Blue Bomber', color: 0x3333ff, speed: 3.0, bombs: 1 },
    { id: 2, name: 'Green Bomber', color: 0x33ff33, speed: 2.0, bombs: 2 },
    { id: 3, name: 'Yellow Bomber', color: 0xffff33, speed: 2.5, bombs: 1 },
  ],
  
  // Stages
  STAGES: [
    { 
      id: 0, 
      name: 'Classic Arena',
      description: 'Traditional Bomberman grid',
      theme: 'classic'
    },
    { 
      id: 1, 
      name: 'Grassland Fields',
      description: 'Green meadows and fresh air',
      theme: 'grassland'
    },
    { 
      id: 2, 
      name: 'Desert Dunes',
      description: 'Hot sandy wasteland',
      theme: 'desert'
    },
    { 
      id: 3, 
      name: 'Sunny Beach',
      description: 'Tropical paradise',
      theme: 'beach'
    },
    { 
      id: 4, 
      name: 'City Roads',
      description: 'Urban asphalt jungle',
      theme: 'roads'
    },
    { 
      id: 5, 
      name: 'Water World',
      description: 'Deep blue waters',
      theme: 'water'
    },
    { 
      id: 6, 
      name: 'Dark Forest',
      description: 'Mysterious woods',
      theme: 'forest'
    },
    { 
      id: 7, 
      name: 'Toxic Zone',
      description: 'Poisonous hazard area',
      theme: 'poison'
    },
    { 
      id: 8, 
      name: 'Frozen Tundra',
      description: 'Icy cold wasteland',
      theme: 'ice'
    },
    { 
      id: 9, 
      name: 'Power Plant',
      description: 'Industrial energy facility',
      theme: 'powerplant'
    },
    { 
      id: 10, 
      name: 'Midnight Manor',
      description: 'Dark night realm',
      theme: 'night'
    },
    { 
      id: 11, 
      name: 'Dungeon Fortress',
      description: 'Dark dungeon with narrow corridors',
      theme: 'dungeon'
    },
  ],
  
  // Rendering
  CAMERA_ZOOM: 1,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  
  // Sprite Animation
  SPRITE_SIZE: 16,
  ANIMATION_SPEED: 0.15, // seconds per frame
  
  // Collision (for pixel art perspective)
  COLLISION_SIZE_MULTIPLIER: 0.5, // Tighter collision box
  COLLISION_OFFSET_Y: 0.15, // Offset down to align with feet
  
  /**
   * Convert grid position to screen position
   * Applies the centering offset to transform from grid space to screen space
   * @param {number} gridPos - Position in grid space (already multiplied by TILE_SIZE)
   * @param {boolean} isX - Whether this is an X coordinate (default true)
   * @returns {number} Position in screen space
   */
  gridToScreen(gridPos, isX = true) {
    const gridSize = isX ? this.GRID_WIDTH : this.GRID_HEIGHT;
    return gridPos - (gridSize * this.TILE_SIZE) / 2;
  }
};
