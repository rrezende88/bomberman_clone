import { GameConfig } from '../utils/GameConfig.js';

export class AISystem {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  update(deltaTime) {
    // Update all enemy AI
    for (const enemy of this.gameScene.enemies) {
      if (!enemy.isAlive) continue;
      
      // Check for nearby bombs and avoid them
      if (this.isInDanger(enemy)) {
        this.avoidDanger(enemy);
      }
    }
  }

  isInDanger(enemy) {
    const enemyGridX = Math.floor(enemy.x / GameConfig.TILE_SIZE);
    const enemyGridY = Math.floor(enemy.y / GameConfig.TILE_SIZE);
    
    // Check all bombs
    for (const bomb of this.gameScene.bombs) {
      if (bomb.isExploded) continue;
      
      // Check if enemy is in bomb's blast range
      const dx = Math.abs(bomb.gridX - enemyGridX);
      const dy = Math.abs(bomb.gridY - enemyGridY);
      
      // In same column or row and within range
      if ((dx === 0 && dy <= bomb.range) || (dy === 0 && dx <= bomb.range)) {
        // Only in danger if bomb is about to explode (less than 1 second)
        if (bomb.timer < 1000) {
          return true;
        }
      }
    }
    
    return false;
  }

  avoidDanger(enemy) {
    // Try to move away from dangerous areas
    const enemyGridX = Math.floor(enemy.x / GameConfig.TILE_SIZE);
    const enemyGridY = Math.floor(enemy.y / GameConfig.TILE_SIZE);
    
    // Find safest direction
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];
    
    let safestDir = null;
    let maxSafety = -1;
    
    for (const dir of directions) {
      const checkX = enemyGridX + dir.x;
      const checkY = enemyGridY + dir.y;
      
      // Check if this direction is walkable
      const testX = checkX * GameConfig.TILE_SIZE;
      const testY = checkY * GameConfig.TILE_SIZE;
      
      if (this.gameScene.collisionSystem.checkCollision(testX, testY, enemy)) {
        continue; // Can't move here
      }
      
      // Calculate safety score (distance from nearest bomb)
      let safety = this.calculateSafety(checkX, checkY);
      
      if (safety > maxSafety) {
        maxSafety = safety;
        safestDir = dir;
      }
    }
    
    // Move in safest direction
    if (safestDir) {
      enemy.direction = safestDir;
      enemy.changeDirectionTimer = 0.5; // Commit to this direction briefly
    }
  }

  calculateSafety(gridX, gridY) {
    let minDistance = 999;
    
    for (const bomb of this.gameScene.bombs) {
      if (bomb.isExploded) continue;
      
      const dx = Math.abs(bomb.gridX - gridX);
      const dy = Math.abs(bomb.gridY - gridY);
      let distance = dx + dy; // Manhattan distance
      
      // Check if in blast line
      if ((dx === 0 && dy <= bomb.range) || (dy === 0 && dx <= bomb.range)) {
        distance *= 0.5; // Extra penalty for being in blast line
      }
      
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  }
}
