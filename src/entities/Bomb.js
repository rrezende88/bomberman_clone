import * as THREE from 'three';
import { GameConfig } from '../parameters/GameConfig.js';

export class Bomb {
  constructor(game, gridX, gridY, range, owner) {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.range = range;
    this.owner = owner; // Reference to player who placed it
    this.ownerCollisionSystemEnabled = false; // Disabled until owner leaves the tile
    
    // Position at center of tile
    this.x = gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    this.y = gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    
    this.fuseTime = GameConfig.BOMB_FUSE_TIME;
    this.timer = this.fuseTime;
    this.isExploded = false;
    
    this.createSprite();
  }

  createSprite() {
    const texture = this.game.spriteLoader.createBombTexture(32, 1.0);
    const material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(GameConfig.TILE_SIZE * 0.8, GameConfig.TILE_SIZE * 0.8, 1);
    this.updateSpritePosition();
  }

  updateSpritePosition() {
    if (this.sprite) {
      this.sprite.position.set(
        GameConfig.gridToScreen(this.x, true),
        GameConfig.gridToScreen(this.y, false),
        0.5
      );
    }
  }

  checkOwnerLeftTile() {
    if (this.ownerCollisionSystemEnabled || !this.owner) return;
    
    // Calculate distance from owner center to bomb tile center
    const bombCenterX = this.gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    const bombCenterY = this.gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    const distanceX = Math.abs(this.owner.x - bombCenterX);
    const distanceY = Math.abs(this.owner.y - bombCenterY);
    
    // Enable collision once owner has moved far enough from bomb center
    // Use 60% of tile size as buffer to ensure owner has cleared the bomb
    const exitOffset = GameConfig.TILE_SIZE;
    
    if (distanceX > exitOffset || distanceY > exitOffset) {
      this.ownerCollisionSystemEnabled = true;
    }
  }

  update(deltaTime, gameScene) {
    if (this.isExploded) return;
    
    // Check if owner has left the bomb tile
    this.checkOwnerLeftTile();
    
    this.timer -= deltaTime * 1000; // Convert to milliseconds
    
    // Update bomb texture based on timer
    const progress = this.timer / this.fuseTime;
    const texture = this.game.spriteLoader.createBombTexture(32, progress);
    this.sprite.material.map = texture;
    this.sprite.material.needsUpdate = true;
    
    // Animate (bounce)
    const bounce = Math.abs(Math.sin(Date.now() * 0.005)) * 0.1 + 0.9;
    this.sprite.scale.set(
      GameConfig.TILE_SIZE * 0.8 * bounce,
      GameConfig.TILE_SIZE * 0.8 * bounce,
      1
    );
    
    // Explode when timer runs out
    if (this.timer <= 0) {
      this.explode(gameScene);
      // Bomb removes itself from array in explode()
    }
  }

  explode(gameScene) {
    if (this.isExploded) return;
    
    this.isExploded = true;
    
    // Notify owner
    if (this.owner) {
      this.owner.onBombExploded();
    }
    
    // Create explosion
    gameScene.explosionSystem.createExplosion(this.gridX, this.gridY, this.range, gameScene);
    
    // Remove sprite from scene
    if (this.sprite) {
      gameScene.scene.remove(this.sprite);
    }
    
    // Dispose resources
    this.dispose();
    
    // Remove from bombs array immediately
    const index = gameScene.bombs.indexOf(this);
    if (index > -1) {
      gameScene.bombs.splice(index, 1);
    }
  }

  triggerExplosion(gameScene) {
    // Called by chain reaction from other explosions
    if (!this.isExploded) {
      this.timer = 0; // Explode immediately
      this.explode(gameScene);
    }
  }

  dispose() {
    if (this.sprite) {
      if (this.sprite.material) {
        if (this.sprite.material.map) {
          this.sprite.material.map.dispose();
        }
        this.sprite.material.dispose();
      }
      this.sprite = null;
    }
  }

  getSprite() {
    return this.sprite;
  }
}
