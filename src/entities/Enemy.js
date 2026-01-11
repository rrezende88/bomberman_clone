import * as THREE from 'three';
import { GameConfig } from '../parameters/GameConfig.js';
import { ENEMY_TYPES } from '../parameters/EnemyBehaviors.js';

export class Enemy {
  constructor(game, gridX, gridY, type = 'wanderer') {
    this.game = game;
    this.gridX = gridX;
    this.gridY = gridY;
    this.type = type; // wanderer, chaser, patroller
    
    // Position (center of tile)
    this.x = gridX * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    this.y = gridY * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2;
    
    // Movement - base speed varies by type
    const enemyConfig = ENEMY_TYPES[type] || ENEMY_TYPES.wanderer;
    this.baseSpeed = enemyConfig.baseSpeed;
    this.speed = this.baseSpeed;
    this.direction = { x: 0, y: 0 };
    this.changeDirectionTimer = 0;
    
    // Type-specific properties from configuration
    this.immuneToSlowdown = enemyConfig.immuneToSlowdown;
    
    // State
    this.isAlive = true;
    
    // Patrol points for patroller type
    this.patrolPoints = [];
    this.currentPatrolIndex = 0;
    
    this.createSprite();
  }


  createSprite() {
    const texture = this.game.spriteLoader.createEnemyTexture(this.type, 32);
    const material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(GameConfig.TILE_SIZE * 0.7, GameConfig.TILE_SIZE * 0.7, 1);
    this.updateSpritePosition();
  }

  updateSpritePosition() {
    if (this.sprite) {
      this.sprite.position.set(
        GameConfig.gridToScreen(this.x, true),
        GameConfig.gridToScreen(this.y, false),
        1
      );
    }
  }

  update(deltaTime, gameScene) {
    if (!this.isAlive) return;
    
    this.changeDirectionTimer -= deltaTime;
    
    // Get AI direction based on type
    if (this.changeDirectionTimer <= 0) {
      this.updateDirection(gameScene);
      this.changeDirectionTimer = 1.0 + Math.random() * 2.0; // Change direction every 1-3 seconds
    }
    
    // Move with tile speed modifier
    if (this.direction.x !== 0 || this.direction.y !== 0) {
      const speedModifier = this.getTileSpeedModifier(gameScene);
      const effectiveSpeed = this.baseSpeed * speedModifier;
      const newX = this.x + this.direction.x * effectiveSpeed * deltaTime * 60;
      const newY = this.y + this.direction.y * effectiveSpeed * deltaTime * 60;
      
      // Check collision separately for X and Y axes
      let moved = false;
      if (!gameScene.collisionSystem.checkCollision(newX, this.y, this)) {
        this.x = newX;
        moved = true;
      }
      if (!gameScene.collisionSystem.checkCollision(this.x, newY, this)) {
        this.y = newY;
        moved = true;
      }
      
      // If stuck, change direction immediately
      if (!moved) {
        this.changeDirectionTimer = 0;
      }
      
      // Update grid position (use floor since entity is centered in tile)
      this.gridX = Math.floor(this.x / GameConfig.TILE_SIZE);
      this.gridY = Math.floor(this.y / GameConfig.TILE_SIZE);
    }
    
    this.updateSpritePosition();
  }

  /**
   * Get speed modifier based on current tile
   * Returns additive speed modifier (effectiveSpeed = baseSpeed * (1 + modifier))
   * Patroller enemies are immune to negative modifiers (slowdowns)
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
      let modifier = specialTile.properties.speedModifier;
      
      // Check if enemy is immune to slowdown (negative modifiers)
      if (this.immuneToSlowdown && modifier < 0) {
        modifier = 0;
      }
      
      // Return effective multiplier (1 + modifier)
      return 1.0 + modifier;
    }
    
    return 1.0;
  }

  updateDirection(gameScene) {
    switch (this.type) {
      case 'wanderer':
        this.wandererAI();
        break;
      case 'chaser':
        this.chaserAI(gameScene);
        break;
      case 'patroller':
        this.patrollerAI();
        break;
    }
  }

  wandererAI() {
    // Random movement
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];
    this.direction = directions[Math.floor(Math.random() * directions.length)];
  }

  chaserAI(gameScene) {
    // Simple pathfinding toward player
    if (!gameScene.player || !gameScene.player.isAlive) {
      this.wandererAI();
      return;
    }
    
    const dx = gameScene.player.x - this.x;
    const dy = gameScene.player.y - this.y;
    
    // Choose direction based on larger distance
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = { x: Math.sign(dx), y: 0 };
    } else {
      this.direction = { x: 0, y: Math.sign(dy) };
    }
  }

  patrollerAI() {
    // Follow patrol points if set, otherwise wander
    if (this.patrolPoints.length === 0) {
      this.wandererAI();
      return;
    }
    
    const target = this.patrolPoints[this.currentPatrolIndex];
    const dx = target.x * GameConfig.TILE_SIZE - this.x;
    const dy = target.y * GameConfig.TILE_SIZE - this.y;
    
    // If close to patrol point, move to next
    if (Math.abs(dx) < GameConfig.TILE_SIZE / 2 && Math.abs(dy) < GameConfig.TILE_SIZE / 2) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      return;
    }
    
    // Move toward patrol point
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = { x: Math.sign(dx), y: 0 };
    } else {
      this.direction = { x: 0, y: Math.sign(dy) };
    }
  }

  setPatrolPoints(points) {
    this.patrolPoints = points;
    this.currentPatrolIndex = 0;
  }

  die(gameScene) {
    this.isAlive = false;
    if (this.sprite) {
      this.sprite.visible = false;
    }
    
    // Drop power-up randomly
    if (Math.random() < GameConfig.POWERUP_DROP_CHANCE) {
      const types = ['bomb', 'fire', 'speed'];
      const type = types[Math.floor(Math.random() * types.length)];
      gameScene.createPowerup(this.gridX, this.gridY, type);
    }
  }

  getSprite() {
    return this.sprite;
  }
}
