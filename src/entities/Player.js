import * as THREE from 'three';
import { GameConfig } from '../utils/GameConfig.js';

export class Player {
  constructor(game, gridX, gridY, character) {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.character = character;
    
    // Stats
    this.speed = character.speed;
    this.maxBombs = character.bombs;
    this.bombRange = GameConfig.PLAYER_BOMB_RANGE;
    this.lives = GameConfig.PLAYER_LIVES;
    this.activeBombs = 0;
    
    // Movement (position at center of tile)
    this.targetX = gridX;
    this.targetY = gridY;
    this.x = gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    this.y = gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    
    // State
    this.isAlive = true;
    this.invulnerable = false;
    this.invulnerableTime = 0;
    
    // Animation
    this.direction = 'down'; // 'down', 'up', 'left', 'right'
    this.animationFrame = 0; // 0=idle, 1=walk1, 2=walk2
    this.animationTimer = 0;
    this.isMoving = false;
    this.spriteSheet = null;
    this.spriteSheetLoaded = false;
    this.sprite = null;
    
    // Note: createSprite() is now async and called from GameScene.spawnPlayer()
  }

  async createSprite() {
    // Determine sprite sheet path based on character
    const colorName = this.character.name.split(' ')[0].toLowerCase(); // 'Red Bomber' -> 'red'
    const spritePath = `./sprites/player_${colorName}.png`;
    
    try {
      // Load sprite sheet
      this.spriteSheet = await this.game.spriteLoader.loadSpriteSheet(spritePath);
      this.spriteSheetLoaded = true;
      
      // Create initial sprite with idle frame facing down
      const texture = this.game.spriteLoader.createAnimatedCharacterTexture(
        this.spriteSheet,
        0, // frameX (idle)
        0, // frameY (down)
        GameConfig.SPRITE_SIZE
      );
      
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      this.sprite = new THREE.Sprite(material);
      this.sprite.scale.set(GameConfig.TILE_SIZE * 0.8, GameConfig.TILE_SIZE * 0.8, 1);
      this.updateSpritePosition();
    } catch (error) {
      console.error('Failed to load character sprite sheet, using fallback', error);
      // Fallback to old colored square sprite
      const texture = this.game.spriteLoader.createCharacterTexture(
        `#${this.character.color.toString(16).padStart(6, '0')}`,
        32
      );
      const material = new THREE.SpriteMaterial({ map: texture });
      this.sprite = new THREE.Sprite(material);
      this.sprite.scale.set(GameConfig.TILE_SIZE * 0.8, GameConfig.TILE_SIZE * 0.8, 1);
      this.updateSpritePosition();
    }
  }

  updateSpritePosition() {
    if (this.sprite) {
      this.sprite.position.set(
        this.x - (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) / 2,
        this.y - (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2,
        1
      );
      
      // Flash when invulnerable
      if (this.invulnerable) {
        this.sprite.material.opacity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
      } else {
        this.sprite.material.opacity = 1;
      }
    }
  }

  updateAnimation(deltaTime) {
    if (!this.spriteSheetLoaded) return;

    if (this.isMoving) {
      // Cycle through animation frames
      this.animationTimer += deltaTime;
      
      if (this.animationTimer >= GameConfig.ANIMATION_SPEED) {
        this.animationTimer = 0;
        
        // Cycle: 0 (idle) -> 1 (walk1) -> 0 (idle) -> 2 (walk2) -> repeat
        if (this.animationFrame === 0) {
          this.animationFrame = 1;
        } else if (this.animationFrame === 1) {
          this.animationFrame = 0;
        } else if (this.animationFrame === 0) {
          this.animationFrame = 2;
        } else {
          this.animationFrame = 0;
        }
      }
    } else {
      // Reset to idle frame when not moving
      this.animationFrame = 0;
      this.animationTimer = 0;
    }

    this.updateSpriteFrame();
  }

  updateSpriteFrame() {
    if (!this.spriteSheetLoaded || !this.sprite) return;

    // Map direction to sprite sheet row
    const directionMap = {
      'down': 0,
      'up': 1,
      'right': 2,
      'left': 3
    };

    const frameY = directionMap[this.direction];
    const frameX = this.animationFrame;

    // Update sprite texture
    const newTexture = this.game.spriteLoader.createAnimatedCharacterTexture(
      this.spriteSheet,
      frameX,
      frameY,
      GameConfig.SPRITE_SIZE
    );

    // Dispose old texture to prevent memory leak
    if (this.sprite.material.map) {
      this.sprite.material.map.dispose();
    }

    this.sprite.material.map = newTexture;
    this.sprite.material.needsUpdate = true;
  }

  update(deltaTime, gameScene) {
    if (!this.isAlive) return;
    
    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerableTime -= deltaTime;
      if (this.invulnerableTime <= 0) {
        this.invulnerable = false;
        this.sprite.material.opacity = 1;
      }
    }
    
    // Get input direction
    const dir = this.game.inputManager.getDirection();
    
    // Track if player is moving
    this.isMoving = (dir.x !== 0 || dir.y !== 0);
    
    if (this.isMoving) {
      // Update facing direction based on movement
      // Prioritize vertical movement for direction
      if (dir.y > 0) {
        this.direction = 'up';
      } else if (dir.y < 0) {
        this.direction = 'down';
      } else if (dir.x > 0) {
        this.direction = 'right';
      } else if (dir.x < 0) {
        this.direction = 'left';
      }
      
      // Calculate new position with tile speed modifier
      const speedModifier = this.getTileSpeedModifier(gameScene);
      const effectiveSpeed = this.speed * speedModifier;
      const newX = this.x + dir.x * effectiveSpeed * deltaTime * 60;
      const newY = this.y + dir.y * effectiveSpeed * deltaTime * 60;
      
      // Check collision separately for X and Y axes
      if (!gameScene.collisionSystem.checkCollision(newX, this.y, this)) {
        this.x = newX;
      }
      if (!gameScene.collisionSystem.checkCollision(this.x, newY, this)) {
        this.y = newY;
      }
      
      // Update grid position (use floor since entity is centered in tile)
      this.gridX = Math.floor(this.x / GameConfig.TILE_SIZE);
      this.gridY = Math.floor(this.y / GameConfig.TILE_SIZE);
    }
    
    // Place bomb
    if (this.game.inputManager.isActionPressed() && this.canPlaceBomb()) {
      this.placeBomb(gameScene);
    }
    
    // Update animation
    this.updateAnimation(deltaTime);
    
    this.updateSpritePosition();
  }

  /**
   * Get speed modifier based on current tile
   * Returns speedModifier from tile properties if on a special tile, otherwise 1.0
   * This method can be copied to Enemy.js for future implementation
   */
  getTileSpeedModifier(gameScene) {
    if (!gameScene.currentStageData || !gameScene.currentStageData.specialTiles) {
      return 1.0;
    }
    
    // Check if current position is on a special tile
    const specialTile = gameScene.currentStageData.specialTiles.find(
      tile => tile.x === this.gridX && tile.y === this.gridY
    );
    
    if (specialTile && specialTile.properties && specialTile.properties.speedModifier !== undefined) {
      return specialTile.properties.speedModifier;
    }
    
    return 1.0;
  }

  canPlaceBomb() {
    return this.activeBombs < this.maxBombs;
  }

  placeBomb(gameScene) {
    // Get grid position for bomb placement (use floor since entity is centered in tile)
    const bombGridX = Math.floor(this.x / GameConfig.TILE_SIZE);
    const bombGridY = Math.floor(this.y / GameConfig.TILE_SIZE);
    
    // Check if there's already a bomb here
    const existingBomb = gameScene.bombs.find(b => b.gridX === bombGridX && b.gridY === bombGridY);
    if (existingBomb) return;
    
    // Create bomb
    const bomb = gameScene.createBomb(bombGridX, bombGridY, this.bombRange, this);
    this.activeBombs++;
  }

  onBombExploded() {
    this.activeBombs = Math.max(0, this.activeBombs - 1);
  }

  takeDamage() {
    if (this.invulnerable || !this.isAlive) return;
    
    this.lives--;
    if (this.lives <= 0) {
      this.die();
    } else {
      this.invulnerable = true;
      this.invulnerableTime = 2; // 2 seconds of invulnerability
    }
  }

  die() {
    this.isAlive = false;
    if (this.sprite) {
      this.sprite.visible = false;
    }
  }

  collectPowerup(type) {
    switch (type) {
      case 'bomb':
        this.maxBombs++;
        break;
      case 'fire':
        this.bombRange++;
        break;
      case 'speed':
        this.speed += 0.5;
        break;
    }
  }

  getSprite() {
    return this.sprite;
  }
}
