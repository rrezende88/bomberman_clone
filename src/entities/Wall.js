import * as THREE from 'three';
import { GameConfig } from '../parameters/GameConfig.js';

export class Wall {
  constructor(game, gridX, gridY, isHard = true, theme = 'classic') {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.isHard = isHard;
    this.isDestroyed = false;
    this.theme = theme;
    
    // Soft walls may contain powerups
    this.hasPowerup = false;
    this.powerupType = null;
    
    if (!isHard && Math.random() < 0.3) {
      this.hasPowerup = true;
      const types = ['bomb', 'fire', 'speed'];
      this.powerupType = types[Math.floor(Math.random() * types.length)];
    }
    
    this.createSprite();
  }

  createSprite() {
    let texture;
    
    // Select texture based on theme
    switch (this.theme) {
      case 'grassland':
        texture = this.game.spriteLoader.createGrasslandWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'desert':
        texture = this.game.spriteLoader.createDesertWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'beach':
        texture = this.game.spriteLoader.createBeachWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'roads':
        texture = this.game.spriteLoader.createRoadsWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'water':
        texture = this.game.spriteLoader.createWaterWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'forest':
        texture = this.game.spriteLoader.createForestWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'poison':
        texture = this.game.spriteLoader.createPoisonWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'ice':
        texture = this.game.spriteLoader.createIceWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'powerplant':
        texture = this.game.spriteLoader.createPowerplantWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'night':
        texture = this.game.spriteLoader.createNightWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      case 'dungeon':
        texture = this.game.spriteLoader.createDungeonWallTexture(this.isHard, GameConfig.TILE_SIZE);
        break;
      default: // classic
        texture = this.game.spriteLoader.createWallTexture(this.isHard, GameConfig.TILE_SIZE);
    }
    
    const material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(GameConfig.TILE_SIZE, GameConfig.TILE_SIZE, 1);
    
    // Convert grid position to screen position
    const gridX = this.gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    const gridY = this.gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    const x = GameConfig.gridToScreen(gridX, true);
    const y = GameConfig.gridToScreen(gridY, false);
    
    this.sprite.position.set(x, y, 0.3);
  }

  destroy(gameScene) {
    if (this.isHard || this.isDestroyed) return false;
    
    this.isDestroyed = true;
    if (this.sprite) {
      this.sprite.visible = false;
    }
    
    // Spawn powerup if this wall had one
    if (this.hasPowerup && this.powerupType) {
      gameScene.createPowerup(this.gridX, this.gridY, this.powerupType);
    }
    
    return true;
  }

  getSprite() {
    return this.sprite;
  }
}
