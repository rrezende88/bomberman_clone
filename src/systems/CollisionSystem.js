import { GameConfig } from '../utils/GameConfig.js';

export class CollisionSystem {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  checkCollision(x, y, entity) {
    // Smaller collision box focused on character's feet/body for better perspective
    const entitySize = GameConfig.TILE_SIZE * GameConfig.COLLISION_SIZE_MULTIPLIER;
    const collisionOffsetY = GameConfig.TILE_SIZE * GameConfig.COLLISION_OFFSET_Y;
    
    // Collision box centered horizontally, but offset down vertically (toward feet)
    const entityLeft = x - entitySize / 2;
    const entityRight = x + entitySize / 2;
    const entityTop = (y - collisionOffsetY) + entitySize / 2;
    const entityBottom = (y - collisionOffsetY) - entitySize / 2;
    
    // Check bounds (with pixel coordinates, accounting for offset)
    const minBoundX = entitySize / 2;
    const maxBoundX = (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) - entitySize / 2;
    const minBoundY = entitySize / 2 + collisionOffsetY;
    const maxBoundY = (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) - entitySize / 2 + collisionOffsetY;
    
    if (x < minBoundX || x > maxBoundX || y < minBoundY || y > maxBoundY) {
      return true; // Collision with boundary
    }
    
    // Check which tiles the entity overlaps with
    const tilesOccupied = this.getTilesOccupiedByEntity(x, y, entitySize);
    
    // Check walls
    for (const wall of this.gameScene.walls) {
      if (wall.isDestroyed) continue;
      
      for (const tile of tilesOccupied) {
        if (wall.gridX === tile.x && wall.gridY === tile.y) {
          // AABB collision check
          const wallLeft = wall.gridX * GameConfig.TILE_SIZE;
          const wallRight = wallLeft + GameConfig.TILE_SIZE;
          const wallTop = wall.gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE;
          const wallBottom = wall.gridY * GameConfig.TILE_SIZE;
          
          if (entityRight > wallLeft && entityLeft < wallRight &&
              entityTop > wallBottom && entityBottom < wallTop) {
            return true; // Collision with wall
          }
        }
      }
    }
    
    // Check bombs
    for (const bomb of this.gameScene.bombs) {
      // Check if entity is the bomb owner
      const isOwner = (bomb.owner === entity);
      
      // Skip collision if entity is the owner AND collision is not yet enabled for owner
      if (isOwner && !bomb.ownerCollisionSystemEnabled) {
        continue; // Owner can pass through their own bomb until they leave
      }
      
      // For everyone else (or owner after leaving), check collision normally
      const bombLeft = bomb.gridX * GameConfig.TILE_SIZE;
      const bombRight = bombLeft + GameConfig.TILE_SIZE;
      const bombTop = bomb.gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE;
      const bombBottom = bomb.gridY * GameConfig.TILE_SIZE;
      
      if (entityRight > bombLeft && entityLeft < bombRight &&
          entityTop > bombBottom && entityBottom < bombTop) {
        return true; // Collision with bomb
      }
    }
    
    return false; // No collision
  }
  
  // Get all tiles that an entity overlaps with
  getTilesOccupiedByEntity(x, y, size) {
    const tiles = [];
    const halfSize = size / 2;
    const collisionOffsetY = GameConfig.TILE_SIZE * GameConfig.COLLISION_OFFSET_Y;
    
    // Apply same offset as collision check - centered horizontally, offset down vertically
    const offsetY = y - collisionOffsetY;
    
    // Check corners and center of the offset collision box
    const positions = [
      { px: x - halfSize, py: offsetY - halfSize }, // Bottom-left
      { px: x + halfSize, py: offsetY - halfSize }, // Bottom-right
      { px: x - halfSize, py: offsetY + halfSize }, // Top-left
      { px: x + halfSize, py: offsetY + halfSize }, // Top-right
      { px: x, py: offsetY }                         // Center
    ];
    
    const tileSet = new Set();
    for (const pos of positions) {
      const tileX = Math.floor(pos.px / GameConfig.TILE_SIZE);
      const tileY = Math.floor(pos.py / GameConfig.TILE_SIZE);
      const key = `${tileX},${tileY}`;
      
      if (tileX >= 0 && tileX < GameConfig.GRID_WIDTH &&
          tileY >= 0 && tileY < GameConfig.GRID_HEIGHT) {
        tileSet.add(key);
      }
    }
    
    // Convert set back to array of tile coordinates
    const result = [];
    for (const key of tileSet) {
      const [x, y] = key.split(',').map(Number);
      result.push({ x, y });
    }
    
    return result;
  }

  checkPowerupCollision(player) {
    const playerGridX = Math.floor(player.x / GameConfig.TILE_SIZE);
    const playerGridY = Math.floor(player.y / GameConfig.TILE_SIZE);
    
    for (const powerup of this.gameScene.powerups) {
      if (powerup.isCollected) continue;
      
      if (powerup.gridX === playerGridX && powerup.gridY === playerGridY) {
        powerup.collect(player);
      }
    }
  }

  checkExplosionCollision(gridX, gridY) {
    const results = {
      hitPlayer: false,
      hitEnemies: [],
      hitWalls: [],
      hitBombs: [],
    };
    
    // Check player
    if (this.gameScene.player && this.gameScene.player.isAlive) {
      const playerGridX = Math.floor(this.gameScene.player.x / GameConfig.TILE_SIZE);
      const playerGridY = Math.floor(this.gameScene.player.y / GameConfig.TILE_SIZE);
      
      if (playerGridX === gridX && playerGridY === gridY) {
        results.hitPlayer = true;
        this.gameScene.player.takeDamage();
      }
    }
    
    // Check enemies
    for (const enemy of this.gameScene.enemies) {
      if (!enemy.isAlive) continue;
      
      const enemyGridX = Math.floor(enemy.x / GameConfig.TILE_SIZE);
      const enemyGridY = Math.floor(enemy.y / GameConfig.TILE_SIZE);
      
      if (enemyGridX === gridX && enemyGridY === gridY) {
        results.hitEnemies.push(enemy);
        enemy.die(this.gameScene);
      }
    }
    
    // Check walls
    for (const wall of this.gameScene.walls) {
      if (wall.isDestroyed) continue;
      
      if (wall.gridX === gridX && wall.gridY === gridY) {
        results.hitWalls.push(wall);
        
        // Soft walls can be destroyed
        if (!wall.isHard) {
          wall.destroy(this.gameScene);
        }
      }
    }
    
    // Check bombs (chain reaction)
    for (const bomb of this.gameScene.bombs) {
      if (bomb.isExploded) continue;
      
      if (bomb.gridX === gridX && bomb.gridY === gridY) {
        results.hitBombs.push(bomb);
        bomb.triggerExplosion(this.gameScene);
      }
    }
    
    return results;
  }
}
