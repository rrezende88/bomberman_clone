import * as THREE from 'three';
import { GameConfig } from '../utils/GameConfig.js';
import { CelebrationAnimation } from '../utils/CelebrationAnimation.js';

export class CharacterSelectScene {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    
    this.selectedCharacter = 0;
    this.characterSprites = [];
    this.spriteSheetsLoaded = false;
    
    // Character confirmation state
    this.isConfirmed = false;
    this.confirmTimer = 0;
    this.confirmDuration = 2.0; // 2 seconds
    this.celebrationSprite = null;
    this.celebrationAnimation = null;
    
    this.createCharacterSelection();
  }

  async createCharacterSelection() {
    // Title
    this.createText('SELECT YOUR BOMBER', 0, 220, 56, 0xffff00, { scaleX: 700, scaleY: 100 });
    
    // Create character sprites in a 2x2 grid
    const positions = [
      { x: -120, y: 60 },  // Top left
      { x: 120, y: 60 },   // Top right
      { x: -120, y: -80 }, // Bottom left
      { x: 120, y: -80 },  // Bottom right
    ];
    
    // Load sprite sheets and create character previews
    for (let index = 0; index < GameConfig.CHARACTERS.length; index++) {
      const char = GameConfig.CHARACTERS[index];
      const pos = positions[index];
      
      try {
        // Load sprite sheet for this character
        const colorName = char.name.split(' ')[0].toLowerCase();
        const spritePath = `/sprites/player_${colorName}.png`;
        const spriteSheet = await this.game.spriteLoader.loadSpriteSheet(spritePath);
        
        // Create sprite showing idle frame facing down
        const texture = this.game.spriteLoader.createAnimatedCharacterTexture(
          spriteSheet,
          0, // frameX (idle)
          0, // frameY (down)
          GameConfig.SPRITE_SIZE
        );
        
        const material = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(80, 80, 1);
        sprite.position.set(pos.x, pos.y, 0);
        this.scene.add(sprite);
        this.characterSprites.push(sprite);
      } catch (error) {
        console.error(`Failed to load sprite for ${char.name}, using fallback`, error);
        // Fallback to old colored square
        const texture = this.game.spriteLoader.createCharacterTexture(
          `#${char.color.toString(16).padStart(6, '0')}`,
          64
        );
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(80, 80, 1);
        sprite.position.set(pos.x, pos.y, 0);
        this.scene.add(sprite);
        this.characterSprites.push(sprite);
      }
      
      // Character name
      this.createText(char.name, pos.x, pos.y - 60, 32, 0xffffff, { scaleX: 350, scaleY: 70 });
      
      // Character stats
      const stats = `Speed: ${char.speed} | Bombs: ${char.bombs}`;
      this.createText(stats, pos.x, pos.y - 82, 24, 0xcccccc, { scaleX: 320, scaleY: 60 });
    }
    
    this.spriteSheetsLoaded = true;
    
    // Instructions
    this.createText('Arrow Keys to Select', 0, -200, 36, 0xaaaaaa, { scaleX: 500, scaleY: 75 });
    this.createText('Enter/Space to Confirm | ESC to go back', 0, -235, 28, 0x888888, { scaleX: 700, scaleY: 65 });
    
    // Selection border (simplified with thicker border and blinking)
    const borderGeometry = new THREE.PlaneGeometry(100, 100);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide 
    });
    this.selectionBorder = new THREE.Mesh(borderGeometry, borderMaterial);
    this.selectionBorder.position.z = -1;
    this.scene.add(this.selectionBorder);
    
    // Create border outline with thicker line
    const edgesGeometry = new THREE.EdgesGeometry(borderGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ff00, 
      linewidth: 6,
      transparent: true,
      opacity: 1.0
    });
    this.borderOutline = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.borderOutline.position.z = 1;
    this.scene.add(this.borderOutline);
    
    // Blinking animation timer
    this.blinkTimer = 0;
  }

  createText(text, x, y, size, color, options = {}) {
    const sprite = this.game.fontLoader.createTextSprite(text, size, color, options);
    sprite.position.set(x, y, 0);
    this.scene.add(sprite);
    return sprite;
  }

  async showCelebrationAnimation() {
    // Get position of selected character
    const positions = [
      { x: -120, y: 60 },  // Top left
      { x: 120, y: 60 },   // Top right
      { x: -120, y: -80 }, // Bottom left
      { x: 120, y: -80 },  // Bottom right
    ];
    const pos = positions[this.selectedCharacter];
    
    // Load sprite sheet for the selected character
    const char = GameConfig.CHARACTERS[this.selectedCharacter];
    const colorName = char.name.split(' ')[0].toLowerCase();
    const spritePath = `/sprites/player_${colorName}.png`;
    
    try {
      const spriteSheet = await this.game.spriteLoader.loadSpriteSheet(spritePath);
      
      // Create initial celebration sprite with raised arms pose (frameY = 4)
      const texture = this.game.spriteLoader.createAnimatedCharacterTexture(
        spriteSheet,
        0, // Start with first frame
        4, // frameY = 4 (celebration with raised arms)
        GameConfig.SPRITE_SIZE
      );
      
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true 
      });
      this.celebrationSprite = new THREE.Sprite(material);
      this.celebrationSprite.scale.set(120, 120, 1); // Slightly larger for emphasis
      this.celebrationSprite.position.set(pos.x, pos.y, 2);
      this.scene.add(this.celebrationSprite);
      
      // Initialize celebration animation
      this.celebrationAnimation = new CelebrationAnimation(
        this.celebrationSprite,
        spriteSheet,
        this.game.spriteLoader
      );
      
    } catch (error) {
      console.error('Failed to load celebration sprite:', error);
      // Fallback to simple colored sprite if loading fails
      const texture = this.game.spriteLoader.createCharacterTexture(
        `#${char.color.toString(16).padStart(6, '0')}`,
        64
      );
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true 
      });
      this.celebrationSprite = new THREE.Sprite(material);
      this.celebrationSprite.scale.set(100, 100, 1);
      this.celebrationSprite.position.set(pos.x, pos.y, 2);
      this.scene.add(this.celebrationSprite);
    }
    
    // Hide original character sprite and selection border
    if (this.characterSprites[this.selectedCharacter]) {
      this.characterSprites[this.selectedCharacter].visible = false;
    }
    if (this.borderOutline) {
      this.borderOutline.visible = false;
    }
    if (this.selectionBorder) {
      this.selectionBorder.visible = false;
    }
  }

  updateSelectionBorder() {
    const positions = [
      { x: -120, y: 60 },
      { x: 120, y: 60 },
      { x: -120, y: -80 },
      { x: 120, y: -80 },
    ];
    
    const pos = positions[this.selectedCharacter];
    this.selectionBorder.position.set(pos.x, pos.y, -1);
    this.borderOutline.position.set(pos.x, pos.y, 1);
  }

  onEnter() {
    console.log('Entered Character Select');
    this.selectedCharacter = 0;
    this.isConfirmed = false;
    this.confirmTimer = 0;
    
    // Remove celebration sprite if it exists
    if (this.celebrationSprite) {
      this.scene.remove(this.celebrationSprite);
      this.celebrationSprite = null;
    }
    if (this.celebrationAnimation) {
      this.celebrationAnimation.dispose();
      this.celebrationAnimation = null;
    }
    
    // Show all character sprites and selection border
    this.characterSprites.forEach(sprite => {
      if (sprite) sprite.visible = true;
    });
    
    if (this.borderOutline) {
      this.borderOutline.visible = true;
    }
    if (this.selectionBorder) {
      this.selectionBorder.visible = true;
    }
    
    this.updateSelectionBorder();
  }

  onExit() {
    console.log('Exited Character Select');
    
    // Clean up celebration sprite
    if (this.celebrationSprite) {
      this.scene.remove(this.celebrationSprite);
      this.celebrationSprite = null;
    }
    if (this.celebrationAnimation) {
      this.celebrationAnimation.dispose();
      this.celebrationAnimation = null;
    }
  }

  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Handle confirmation state
    if (this.isConfirmed) {
      this.confirmTimer += deltaTime;
      
      // Animate celebration character
      if (this.celebrationAnimation) {
        this.celebrationAnimation.update(deltaTime, this.confirmTimer);
      }
      
      // After 2 seconds, transition to stage select
      if (this.confirmTimer >= this.confirmDuration) {
        this.game.selectedCharacter = GameConfig.CHARACTERS[this.selectedCharacter];
        this.game.sceneManager.switchTo('stageSelect');
      }
      
      return; // Skip navigation while confirming
    }
    
    // Blinking animation for selection border
    if (this.borderOutline && this.borderOutline.material) {
      this.blinkTimer += deltaTime;
      const opacity = Math.abs(Math.sin(this.blinkTimer * 3)) * 0.5 + 0.5; // Blink between 0.5 and 1.0
      this.borderOutline.material.opacity = opacity;
    }
    
    // Navigation
    const oldSelection = this.selectedCharacter;
    
    if (input.actions.left && !input.previousActions.left) {
      if (this.selectedCharacter % 2 === 1) {
        this.selectedCharacter -= 1;
      }
    }
    
    if (input.actions.right && !input.previousActions.right) {
      if (this.selectedCharacter % 2 === 0) {
        this.selectedCharacter += 1;
      }
    }
    
    if (input.actions.up && !input.previousActions.up) {
      if (this.selectedCharacter >= 2) {
        this.selectedCharacter -= 2;
      }
    }
    
    if (input.actions.down && !input.previousActions.down) {
      if (this.selectedCharacter < 2) {
        this.selectedCharacter += 2;
      }
    }
    
    // Update border if selection changed
    if (oldSelection !== this.selectedCharacter) {
      this.updateSelectionBorder();
    }
    
    // Confirm selection - show celebration and start timer
    if (input.isActionPressed()) {
      this.isConfirmed = true;
      this.confirmTimer = 0;
      this.showCelebrationAnimation();
    }
    
    // Back to menu
    if (input.isPausePressed()) {
      this.game.sceneManager.switchTo('mainMenu');
    }
  }
}
