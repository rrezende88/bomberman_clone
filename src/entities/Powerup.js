import * as THREE from 'three';
import { GameConfig } from '../parameters/GameConfig.js';

export class Powerup {
  constructor(game, gridX, gridY, type) {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.type = type; // bomb, fire, speed
    
    // Position at center of tile
    this.x = gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    this.y = gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    
    this.lifetime = GameConfig.POWERUP_LIFETIME;
    this.isCollected = false;
    
    this.createSprite();
  }

  createSprite() {
    const texture = this.game.spriteLoader.createPowerupTexture(this.type, 32);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(GameConfig.TILE_SIZE * 0.6, GameConfig.TILE_SIZE * 0.6, 1);
    this.updateSpritePosition();
  }

  updateSpritePosition() {
    if (this.sprite) {
      this.sprite.position.set(
        GameConfig.gridToScreen(this.x, true),
        GameConfig.gridToScreen(this.y, false),
        0.4
      );
    }
  }

  update(deltaTime) {
    if (this.isCollected) return false;
    
    this.lifetime -= deltaTime * 1000;
    
    // Flash when about to expire
    if (this.lifetime < 3000) {
      this.sprite.material.opacity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
    }
    
    // Float animation
    const float = Math.sin(Date.now() * 0.003) * 5;
    this.sprite.position.y = this.y - (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2 + float;
    
    // Rotate slowly
    this.sprite.material.rotation += deltaTime * 2;
    
    // Remove if expired
    if (this.lifetime <= 0) {
      if (this.sprite) {
        this.sprite.visible = false;
      }
      return false;
    }
    
    return true;
  }

  collect(player) {
    if (this.isCollected) return;
    
    this.isCollected = true;
    
    // Apply specific benefit based on type
    switch (this.type) {
      case 'bomb':
        player.addBombCapacity(1);
        break;
      case 'fire':
        player.addBombRange(1);
        break;
      case 'speed':
        player.addSpeed(0.5);
        break;
    }
    
    if (this.sprite) {
      this.sprite.visible = false;
    }
  }

  getSprite() {
    return this.sprite;
  }
}
