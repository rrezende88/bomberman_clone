import * as THREE from 'three';
import { GameConfig } from '../utils/GameConfig.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Bomb } from '../entities/Bomb.js';
import { Wall } from '../entities/Wall.js';
import { Powerup } from '../entities/Powerup.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { ExplosionSystem } from '../systems/ExplosionSystem.js';
import { AISystem } from '../systems/AISystem.js';
import { StageLoader } from '../utils/StageLoader.js';
import { CelebrationAnimation } from '../utils/CelebrationAnimation.js';
import { STAGES } from '../data/stages.js';

export class GameScene {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a4a2a);
    
    // Game entities
    this.player = null;
    this.enemies = [];
    this.bombs = [];
    this.walls = [];
    this.powerups = [];
    
    // Game systems
    this.collisionSystem = new CollisionSystem(this);
    this.explosionSystem = new ExplosionSystem(this.game, this);
    this.aiSystem = new AISystem(this);
    this.stageLoader = new StageLoader();
    
    // Game state
    this.gameTime = GameConfig.GAME_TIME;
    this.score = 0;
    this.isGameOver = false;
    this.isVictory = false;
    this.allEnemiesDefeated = false;
    this.victoryDelayTimer = 0;
    this.victoryScreenTimer = 0;
    this.currentStageData = null;
    this.currentTheme = 'classic';
    this.gameReady = false;
    
    // HUD elements
    this.hudSprites = [];
    
    // Special floor tiles
    this.specialTileSprites = [];
    
    // Victory celebration
    this.celebrationAnimation = null;
    
    this.createFloor();
  }

  createFloor() {
    // Store floor for later updates based on theme
    this.floor = null;
    this.updateFloor();
  }

  updateFloor() {
    // Remove old floor if exists
    if (this.floor) {
      this.scene.remove(this.floor);
    }

    // Create floor grid based on theme
    let floorTexture;
    let backgroundColor;
    
    switch (this.currentTheme) {
      case 'grassland':
        floorTexture = this.game.spriteLoader.createGrasslandFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x6ab04c); // Green
        break;
      case 'desert':
        floorTexture = this.game.spriteLoader.createDesertFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0xf0c674); // Sandy yellow
        break;
      case 'beach':
        floorTexture = this.game.spriteLoader.createBeachFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x87ceeb); // Sky blue
        break;
      case 'roads':
        floorTexture = this.game.spriteLoader.createRoadsFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x2a2a2a); // Dark gray
        break;
      case 'water':
        floorTexture = this.game.spriteLoader.createWaterFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x0077be); // Deep blue
        break;
      case 'forest':
        floorTexture = this.game.spriteLoader.createForestFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x1a3a1a); // Dark green
        break;
      case 'poison':
        floorTexture = this.game.spriteLoader.createPoisonFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x6b8e23); // Toxic green
        break;
      case 'ice':
        floorTexture = this.game.spriteLoader.createIceFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0xd0e8f0); // Icy blue
        break;
      case 'powerplant':
        floorTexture = this.game.spriteLoader.createPowerplantFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x1a1a1a); // Industrial black
        break;
      case 'night':
        floorTexture = this.game.spriteLoader.createNightFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x0a0a1e); // Dark night
        break;
      case 'dungeon':
        floorTexture = this.game.spriteLoader.createDungeonFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x3a2f25); // Warm brown
        break;
      default: // classic
        floorTexture = this.game.spriteLoader.createFloorTexture(GameConfig.TILE_SIZE);
        backgroundColor = new THREE.Color(0x2a4a2a); // Classic green
    }
    
    this.scene.background = backgroundColor;
    floorTexture.repeat.set(GameConfig.GRID_WIDTH, GameConfig.GRID_HEIGHT);
    
    const geometry = new THREE.PlaneGeometry(
      GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE,
      GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE
    );
    const material = new THREE.MeshBasicMaterial({ map: floorTexture });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.position.z = -1;
    this.scene.add(this.floor);
  }

  generateStage(stageId) {
    // Clear existing entities
    this.walls = [];
    this.enemies = [];
    this.bombs = [];
    this.powerups = [];
    
    // Clear special tile sprites
    for (const sprite of this.specialTileSprites) {
      this.scene.remove(sprite);
    }
    this.specialTileSprites = [];
    
    // Determine stage theme from GameConfig
    const stageConfig = GameConfig.STAGES[stageId];
    this.currentTheme = stageConfig ? stageConfig.theme : 'classic';
    
    // Update floor based on theme
    this.updateFloor();
    
    // Load stage data from imported constants
    try {
      const stageText = STAGES[stageId] || STAGES[0];
      this.currentStageData = this.stageLoader.loadStage(stageText, `stage_${stageId}`);
      
      // Validate stage dimensions
      if (!this.stageLoader.validateStage(this.currentStageData, GameConfig.GRID_WIDTH, GameConfig.GRID_HEIGHT)) {
        console.warn('Stage validation failed, using fallback');
        this.currentStageData = this.stageLoader.createDefaultStage();
      }
      
      // Create walls from stage data
      for (const wallPos of this.currentStageData.hardWalls) {
        this.walls.push(new Wall(this.game, wallPos.x, wallPos.y, true, this.currentTheme));
      }
      
      for (const wallPos of this.currentStageData.softWalls) {
        this.walls.push(new Wall(this.game, wallPos.x, wallPos.y, false, this.currentTheme));
      }
      
      // Add all wall sprites to scene
      for (const wall of this.walls) {
        this.scene.add(wall.getSprite());
      }
      
      // Render special tiles
      this.renderSpecialTiles();
      
    } catch (error) {
      console.error('Failed to load stage:', error);
      // Fallback to default stage
      this.currentStageData = this.stageLoader.createDefaultStage();
      this.generateDefaultWalls();
    }
  }

  renderSpecialTiles() {
    // Clear existing special tile sprites
    for (const sprite of this.specialTileSprites) {
      this.scene.remove(sprite);
    }
    this.specialTileSprites = [];
    
    if (!this.currentStageData || !this.currentStageData.specialTiles) {
      return;
    }
    
    // Create visual representations for special tiles
    for (const tile of this.currentStageData.specialTiles) {
      let color;
      
      // Determine color based on tile type
      switch (tile.type) {
        case 'sandFloor':
          color = 0xdaa520; // Golden sand color
          break;
        default:
          color = 0xcccccc; // Default gray
      }
      
      // Create a plane for the tile
      const geometry = new THREE.PlaneGeometry(GameConfig.TILE_SIZE, GameConfig.TILE_SIZE);
      const material = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.7
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position the tile (centered on grid position, with same offset as walls)
      const x = tile.x * GameConfig.TILE_SIZE - (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) / 2 + GameConfig.TILE_SIZE / 2;
      const y = tile.y * GameConfig.TILE_SIZE - (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2 + GameConfig.TILE_SIZE / 2;
      
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = -0.5; // Above floor but below entities
      
      this.scene.add(mesh);
      this.specialTileSprites.push(mesh);
    }
  }

  generateDefaultWalls() {
    // Fallback wall generation if stage loading fails
    for (let y = 0; y < GameConfig.GRID_HEIGHT; y++) {
      for (let x = 0; x < GameConfig.GRID_WIDTH; x++) {
        if (x === 0 || x === GameConfig.GRID_WIDTH - 1 || 
            y === 0 || y === GameConfig.GRID_HEIGHT - 1) {
          this.walls.push(new Wall(this.game, x, y, true, this.currentTheme));
        } else if (x % 2 === 0 && y % 2 === 0) {
          this.walls.push(new Wall(this.game, x, y, true, this.currentTheme));
        }
      }
    }
    
    // Add walls to scene
    for (const wall of this.walls) {
      this.scene.add(wall.getSprite());
    }
  }

  async spawnPlayer(character) {
    // Spawn player at position from stage data, or default to (1, 1)
    let spawnX = 1;
    let spawnY = 1;
    
    if (this.currentStageData && this.currentStageData.playerSpawn) {
      spawnX = this.currentStageData.playerSpawn.x;
      spawnY = this.currentStageData.playerSpawn.y;
    }
    
    this.player = new Player(this.game, spawnX, spawnY, character);
    await this.player.createSprite(); // Wait for sprite to load
    this.scene.add(this.player.getSprite());
  }

  spawnEnemies() {
    // Use enemy positions from stage data if available
    let enemySpawns = [];
    
    if (this.currentStageData && this.currentStageData.enemies && this.currentStageData.enemies.length > 0) {
      enemySpawns = this.currentStageData.enemies;
    } else {
      // Fallback to default spawn positions
      enemySpawns = [
        { x: GameConfig.GRID_WIDTH - 2, y: GameConfig.GRID_HEIGHT - 2, type: 'chaser' },
        { x: GameConfig.GRID_WIDTH - 2, y: 1, type: 'wanderer' },
        { x: 1, y: GameConfig.GRID_HEIGHT - 2, type: 'wanderer' },
      ];
    }
    
    for (const spawn of enemySpawns) {
      // Check if position is clear
      const hasWall = this.walls.some(wall => 
        wall.gridX === spawn.x && wall.gridY === spawn.y && !wall.isDestroyed
      );
      
      if (!hasWall) {
        const enemy = new Enemy(this.game, spawn.x, spawn.y, spawn.type);
        
        // Set patrol points for patrollers (if in center area of stage 2)
        if (spawn.type === 'patroller' && this.currentTheme === 'dungeon') {
          const centerX = Math.floor(GameConfig.GRID_WIDTH / 2);
          const centerY = Math.floor(GameConfig.GRID_HEIGHT / 2);
          enemy.setPatrolPoints([
            { x: centerX - 1, y: centerY - 1 },
            { x: centerX + 1, y: centerY - 1 },
            { x: centerX + 1, y: centerY + 1 },
            { x: centerX - 1, y: centerY + 1 },
          ]);
        }
        
        this.enemies.push(enemy);
        this.scene.add(enemy.getSprite());
      }
    }
  }

  createBomb(gridX, gridY, range, owner) {
    const bomb = new Bomb(this.game, gridX, gridY, range, owner);
    this.bombs.push(bomb);
    this.scene.add(bomb.getSprite());
    return bomb;
  }

  createPowerup(gridX, gridY, type) {
    const powerup = new Powerup(this.game, gridX, gridY, type);
    this.powerups.push(powerup);
    this.scene.add(powerup.getSprite());
    return powerup;
  }


  createHUD() {
    // Clear existing HUD
    this.hudSprites.forEach(sprite => this.scene.remove(sprite));
    this.hudSprites = [];
    
    // Position HUD in the dedicated top row (above the game grid)
    // The game grid is now 11 rows, so we use the space above it for HUD
    const hudY = (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2 + GameConfig.TILE_SIZE / 2 - 10;
    
    // Health Bar (replaces Lives text)
    const healthTexture = this.game.fontLoader.createHealthBarTexture(
      this.player ? this.player.lives : GameConfig.PLAYER_LIVES,
      GameConfig.PLAYER_LIVES,
      180,  // width
      28    // height
    );
    const healthMaterial = new THREE.SpriteMaterial({ map: healthTexture, transparent: true });
    this.healthBar = new THREE.Sprite(healthMaterial);
    this.healthBar.scale.set(320, 70, 1);
    this.healthBar.position.set(-380, hudY, 5);
    this.scene.add(this.healthBar);
    this.hudSprites.push(this.healthBar);
    
    // Score
    this.scoreText = this.createHUDText(
      `SCORE ${this.score}`,
      0, hudY, 42, 0xffff00, { scaleX: 400, scaleY: 80 }
    );
    this.hudSprites.push(this.scoreText);
    
    // Timer
    this.timerText = this.createHUDText(
      `TIME ${Math.ceil(this.gameTime)}`,
      380, hudY, 42, 0x00ff00, { scaleX: 350, scaleY: 80 }
    );
    this.hudSprites.push(this.timerText);
  }

  createHUDText(text, x, y, size, color, options = {}) {
    const sprite = this.game.fontLoader.createTextSprite(text, size, color, options);
    sprite.position.set(x, y, 5);
    this.scene.add(sprite);
    return sprite;
  }

  updateHUD() {
    // Update health bar
    if (this.healthBar && this.player) {
      const healthTexture = this.game.fontLoader.createHealthBarTexture(
        this.player.lives,
        GameConfig.PLAYER_LIVES,
        180,  // width
        28    // height
      );
      if (this.healthBar.material.map) {
        this.healthBar.material.map.dispose();
      }
      this.healthBar.material.map = healthTexture;
      this.healthBar.material.needsUpdate = true;
    }
    
    if (this.scoreText) {
      this.updateHUDText(this.scoreText, `SCORE ${this.score}`, 42, 0xffff00, { scaleX: 400, scaleY: 80 });
    }
    
    if (this.timerText) {
      const timeColor = this.gameTime < 30 ? 0xff0000 : 0x00ff00;
      this.updateHUDText(this.timerText, `TIME ${Math.ceil(this.gameTime)}`, 42, timeColor, { scaleX: 350, scaleY: 80 });
    }
  }

  updateHUDText(sprite, text, size, color, options = {}) {
    this.game.fontLoader.updateTextSprite(sprite, text, size, color, options);
  }

  async onEnter(data) {
    console.log('Entered Game Scene');
    
    // Initialize game
    const character = this.game.selectedCharacter || GameConfig.CHARACTERS[0];
    const stage = this.game.selectedStage || GameConfig.STAGES[0];
    
    this.gameTime = GameConfig.GAME_TIME;
    this.score = 0;
    this.isGameOver = false;
    this.isVictory = false;
    this.allEnemiesDefeated = false;
    this.victoryDelayTimer = 0;
    this.victoryScreenTimer = 0;
    this.gameReady = false;
    
    // Reset celebration state
    if (this.celebrationAnimation) {
      this.celebrationAnimation.dispose();
      this.celebrationAnimation = null;
    }
    
    // Generate stage (synchronous now)
    this.generateStage(stage.id);
    
    // Spawn entities
    await this.spawnPlayer(character);
    this.spawnEnemies();
    
    // Create HUD
    this.createHUD();
    
    // Mark game as ready after all initialization is complete
    this.gameReady = true;
  }

  onExit() {
    console.log('Exited Game Scene');
    
    // Clean up
    if (this.player && this.player.sprite) {
      this.scene.remove(this.player.sprite);
    }
    
    // Reset celebration state
    if (this.celebrationAnimation) {
      this.celebrationAnimation.dispose();
      this.celebrationAnimation = null;
    }
    
    this.enemies.forEach(enemy => {
      if (enemy.sprite) this.scene.remove(enemy.sprite);
    });
    
    this.bombs.forEach(bomb => {
      if (bomb.sprite) this.scene.remove(bomb.sprite);
    });
    
    this.walls.forEach(wall => {
      if (wall.sprite) this.scene.remove(wall.sprite);
    });
    
    this.powerups.forEach(powerup => {
      if (powerup.sprite) this.scene.remove(powerup.sprite);
    });
    
    this.hudSprites.forEach(sprite => this.scene.remove(sprite));
  }

  update(deltaTime) {
    if (this.isGameOver) {
      // If victory, count down to stage select and animate celebration
      if (this.isVictory) {
        this.victoryScreenTimer -= deltaTime;
        
        // Animate player celebration
        if (this.celebrationAnimation) {
          // Use elapsed time since victory for timer (invert victoryScreenTimer for increasing time)
          const elapsedTime = 3.0 - this.victoryScreenTimer;
          this.celebrationAnimation.update(deltaTime, elapsedTime);
        }
        
        // Check for action button to skip to stage select immediately
        if (this.game.inputManager.isActionPressed() || this.victoryScreenTimer <= 0) {
          this.game.sceneManager.switchTo('stageSelect');
          return;
        }
      } else {
        // Game over (not victory) - allow restart to main menu
        if (this.game.inputManager.isActionPressed()) {
          this.game.sceneManager.switchTo('mainMenu');
        }
      }
      return;
    }
    
    // Update game timer
    this.gameTime -= deltaTime;
    if (this.gameTime <= 0) {
      this.gameTime = 0;
      this.gameOver(false);
      return;
    }
    
    // Update player
    if (this.player && this.player.isAlive) {
      this.player.update(deltaTime, this);
      
      // Check powerup collection
      this.collisionSystem.checkPowerupCollision(this.player);
    } else if (this.player && !this.player.isAlive) {
      this.gameOver(false);
      return;
    }
    
    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(deltaTime, this);
      
      // Check collision with player
      if (enemy.isAlive && this.player && this.player.isAlive) {
        const playerGridX = Math.floor(this.player.x / GameConfig.TILE_SIZE);
        const playerGridY = Math.floor(this.player.y / GameConfig.TILE_SIZE);
        const enemyGridX = Math.floor(enemy.x / GameConfig.TILE_SIZE);
        const enemyGridY = Math.floor(enemy.y / GameConfig.TILE_SIZE);
        
        if (playerGridX === enemyGridX && playerGridY === enemyGridY) {
          this.player.takeDamage();
        }
      }
    }
    
    // Update AI system
    this.aiSystem.update(deltaTime);
    
    // Update bombs - bombs now remove themselves when they explode
    this.bombs.forEach(bomb => bomb.update(deltaTime, this));
    
    // Update powerups
    this.powerups = this.powerups.filter(powerup => powerup.update(deltaTime));
    
    // Update explosions
    this.explosionSystem.update(deltaTime);
    
    // Check win condition (all enemies defeated)
    const aliveEnemies = this.enemies.filter(e => e.isAlive).length;
    if (aliveEnemies === 0 && !this.allEnemiesDefeated && this.gameReady) {
      this.allEnemiesDefeated = true;
      this.victoryDelayTimer = 1.0; // 1 second delay before victory screen
      this.score += 1000; // Bonus for defeating all enemies
    }
    
    // Handle victory delay
    if (this.allEnemiesDefeated && !this.isGameOver) {
      this.victoryDelayTimer -= deltaTime;
      if (this.victoryDelayTimer <= 0) {
        this.gameOver(true);
        return;
      }
    }
    
    // Update HUD
    this.updateHUD();
    
    // Pause
    if (this.game.inputManager.isPausePressed()) {
      if (confirm('Pause\n\nReturn to main menu?')) {
        this.game.sceneManager.switchTo('mainMenu');
      }
    }
  }

  showVictoryCelebration() {
    if (!this.player || !this.player.sprite || !this.player.spriteSheet) return;
    
    // Initialize celebration animation with player sprite
    this.celebrationAnimation = new CelebrationAnimation(
      this.player.sprite,
      this.player.spriteSheet,
      this.game.spriteLoader
    );
    
    // Set initial celebration pose
    this.celebrationAnimation.setInitialPose();
  }

  gameOver(victory) {
    this.isGameOver = true;
    this.isVictory = victory;
    
    // Calculate final score
    if (victory) {
      this.score += Math.floor(this.gameTime) * 10; // Time bonus
      this.victoryScreenTimer = 3.0; // 3 seconds before redirecting to stage select
      
      // Show victory celebration animation
      this.showVictoryCelebration();
    }
    
    // Show game over message
    const message = victory ? 'VICTORY!' : 'GAME OVER';
    const color = victory ? 0x00ff00 : 0xff0000;
    
    const gameOverText = this.createHUDText(message, 0, 150, 72, color, { scaleX: 650, scaleY: 120 });
    this.hudSprites.push(gameOverText);
    
    const finalScoreText = this.createHUDText(`Final Score: ${this.score}`, 0, 80, 48, 0xffff00, { scaleX: 550, scaleY: 90 });
    this.hudSprites.push(finalScoreText);
    
    if (victory) {
      const continueText = this.createHUDText('Returning to stage select...', 0, 20, 36, 0xcccccc, { scaleX: 650, scaleY: 75 });
      this.hudSprites.push(continueText);
    } else {
      const continueText = this.createHUDText('Press Enter to continue', 0, -80, 36, 0xcccccc, { scaleX: 550, scaleY: 75 });
      this.hudSprites.push(continueText);
    }
  }
}
