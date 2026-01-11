import * as THREE from 'three';
import { GameConfig } from '../parameters/GameConfig.js';

export class ExplosionSystem {
  constructor(game, gameScene) {
    this.game = game;
    this.gameScene = gameScene;
    this.explosions = [];
  }

  createExplosion(gridX, gridY, range, gameScene) {
    const explosionTiles = [];
    
    // Center explosion
    explosionTiles.push({ x: gridX, y: gridY });
    this.gameScene.collisionSystem.checkExplosionCollision(gridX, gridY);
    
    // Expand in 4 directions
    const directions = [
      { dx: 0, dy: 1 },  // Up
      { dx: 0, dy: -1 }, // Down
      { dx: 1, dy: 0 },  // Right
      { dx: -1, dy: 0 }, // Left
    ];
    
    for (const dir of directions) {
      for (let i = 1; i <= range; i++) {
        const checkX = gridX + dir.dx * i;
        const checkY = gridY + dir.dy * i;
        
        // Check bounds
        if (checkX < 0 || checkX >= GameConfig.GRID_WIDTH || 
            checkY < 0 || checkY >= GameConfig.GRID_HEIGHT) {
          break;
        }
        
        // Add explosion tile
        explosionTiles.push({ x: checkX, y: checkY });
        
        // Check collisions
        const result = this.gameScene.collisionSystem.checkExplosionCollision(checkX, checkY);
        
        // Stop explosion at walls
        if (result.hitWalls.length > 0) {
          // Check if any hit wall is hard
          const hasHardWall = result.hitWalls.some(wall => wall.isHard);
          if (hasHardWall) {
            break; // Stop completely at hard walls
          }
          // Soft walls stop the explosion but are destroyed
          break;
        }
      }
    }
    
    // Create visual explosion sprites
    for (const tile of explosionTiles) {
      this.createExplosionSprite(tile.x, tile.y);
    }
  }

  createExplosionSprite(gridX, gridY) {
    const texture = this.game.spriteLoader.createExplosionTexture(GameConfig.TILE_SIZE);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(GameConfig.TILE_SIZE, GameConfig.TILE_SIZE, 1);
    
    const x = gridX * GameConfig.TILE_SIZE - (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) / 2 + GameConfig.TILE_SIZE / 2;
    const y = gridY * GameConfig.TILE_SIZE - (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2 + GameConfig.TILE_SIZE / 2;
    
    sprite.position.set(x, y, 2);
    
    this.explosions.push({
      sprite: sprite,
      lifetime: GameConfig.EXPLOSION_DURATION,
      maxLifetime: GameConfig.EXPLOSION_DURATION,
    });
    
    this.gameScene.scene.add(sprite);
  }

  update(deltaTime) {
    // Update and remove expired explosions
    this.explosions = this.explosions.filter(explosion => {
      explosion.lifetime -= deltaTime * 1000;
      
      // Fade out
      const alpha = explosion.lifetime / explosion.maxLifetime;
      explosion.sprite.material.opacity = alpha;
      
      // Scale up
      const scale = 1 + (1 - alpha) * 0.5;
      explosion.sprite.scale.set(
        GameConfig.TILE_SIZE * scale,
        GameConfig.TILE_SIZE * scale,
        1
      );
      
      if (explosion.lifetime <= 0) {
        this.gameScene.scene.remove(explosion.sprite);
        explosion.sprite.material.dispose();
        explosion.sprite.material.map.dispose();
        return false;
      }
      
      return true;
    });
  }
}
