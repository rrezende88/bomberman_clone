import * as THREE from 'three';
import { GameConfig } from '../utils/GameConfig.js';

export class StageSelectScene {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    
    this.selectedStage = 0;
    this.stageSprites = [];
    this.stageTexts = [];
    
    // Grid configuration (6 columns x 2 rows)
    this.gridCols = 6;
    this.gridRows = 2;
    this.visibleStages = this.gridCols * this.gridRows; // 12 stages visible
    
    this.createStageSelection();
  }

  createStageSelection() {
    // Title
    this.createText('SELECT STAGE', 0, 260, 64, 0xffff00, { scaleX: 700, scaleY: 100 });
    
    // Selected stage title (will be updated dynamically)
    this.selectedStageTitle = this.createText('', 0, 180, 42, 0x00ff00, { scaleX: 800, scaleY: 80 });
    
    // Create stage previews in 6x2 grid
    const spacing = 130;
    const startX = -spacing * 2.5;
    const startY = 50;
    
    GameConfig.STAGES.forEach((stage, index) => {
      const col = index % this.gridCols;
      const row = Math.floor(index / this.gridCols);
      
      const x = startX + col * spacing;
      const y = startY - row * 140;
      
      // Create stage preview
      const texture = this.createStagePreview(stage.id, stage.theme);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(120, 120, 1);
      sprite.position.set(x, y, 0);
      this.scene.add(sprite);
      this.stageSprites.push(sprite);
      
      // Stage number
      const stageText = this.createText(
        `${index + 1}`, 
        x, y - 70, 24, 0xffffff, 
        { scaleX: 300, scaleY: 50 }
      );
      this.stageTexts.push(stageText);
    });
    
    // Instructions
    this.createText('Arrow Keys to Select', 0, -220, 32, 0xaaaaaa, { scaleX: 500, scaleY: 70 });
    this.createText('Enter/Space to Start | ESC to go back', 0, -250, 26, 0x888888, { scaleX: 700, scaleY: 60 });
    
    // Selection border (simplified with thicker border and blinking)
    const borderGeometry = new THREE.PlaneGeometry(130, 130);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide 
    });
    this.selectionBorder = new THREE.Mesh(borderGeometry, borderMaterial);
    this.selectionBorder.position.z = -1;
    this.scene.add(this.selectionBorder);
    
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

  createStagePreview(stageId, theme) {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background based on stage theme
    const themeColors = {
      classic: { bg: '#90EE90', wall: '#666666', soft: '#8B4513' },
      grassland: { bg: '#7cba4e', wall: '#8b8b7a', soft: '#5a8f3a' },
      desert: { bg: '#e6c35c', wall: '#c8a060', soft: '#5a8f4a' },
      beach: { bg: '#f4e4c1', wall: '#d4a8a8', soft: '#e8d4aa' },
      roads: { bg: '#3a3a3a', wall: '#888888', soft: '#ff6600' },
      water: { bg: '#1e90ff', wall: '#87ceeb', soft: '#2e8b57' },
      forest: { bg: '#2d5016', wall: '#4a3020', soft: '#1a4010' },
      poison: { bg: '#7fff00', wall: '#cccc00', soft: '#9932cc' },
      ice: { bg: '#f0f8ff', wall: '#b0e0e6', soft: '#fffafa' },
      powerplant: { bg: '#1a1a1a', wall: '#4a4a4a', soft: '#2a2a2a' },
      night: { bg: '#0f1729', wall: '#1a1a2e', soft: '#0a0a1e' },
      dungeon: { bg: '#2a2a2a', wall: '#3a3a3a', soft: '#4a3020' }
    };
    
    const colors = themeColors[theme] || themeColors.classic;
    
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size, size);
    
    const tileSize = size / 21;
    
    // Draw simplified stage preview with theme colors
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 21; x++) {
        // Border walls
        if (x === 0 || x === 20 || y === 0 || y === 10) {
          ctx.fillStyle = colors.wall;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize - 0.5, tileSize - 0.5);
        }
        // Grid pattern walls
        else if (x % 2 === 0 && y % 2 === 0) {
          ctx.fillStyle = colors.wall;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize - 0.5, tileSize - 0.5);
        }
        // Some soft walls based on theme
        else if (this.shouldDrawSoftWall(x, y, theme)) {
          ctx.fillStyle = colors.soft;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize - 0.5, tileSize - 0.5);
        }
      }
    }
    
    // Add theme-specific decorations
    this.addThemeDecoration(ctx, size, theme);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  shouldDrawSoftWall(x, y, theme) {
    // Different patterns for different themes
    const seed = x * 7 + y * 13;
    const threshold = {
      classic: 0.65,
      grassland: 0.60,
      desert: 0.75,
      beach: 0.70,
      roads: 0.80,
      water: 0.70,
      forest: 0.55,
      poison: 0.50,
      ice: 0.65,
      powerplant: 0.70,
      night: 0.60,
      dungeon: 0.65
    };
    
    return (seed % 100) / 100 > (threshold[theme] || 0.65) && !(x < 3 && y < 3);
  }

  addThemeDecoration(ctx, size, theme) {
    // Add small decorative elements specific to each theme
    ctx.save();
    
    switch (theme) {
      case 'grassland':
        // Grass blades
        ctx.strokeStyle = '#4d8530';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const x = (i * 50 + 20) % size;
          const y = (i * 70 + 30) % size;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y - 8);
          ctx.stroke();
        }
        break;
      
      case 'desert':
        // Sun
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(size - 30, 30, 15, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'beach':
        // Waves
        ctx.strokeStyle = '#4d9fd9';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(size / 2, size - 20 - i * 10, 30, Math.PI, 0);
          ctx.stroke();
        }
        break;
      
      case 'roads':
        // Yellow road lines
        ctx.fillStyle = '#ffff00';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(i * 60 + 10, size / 2, 30, 4);
        }
        break;
      
      case 'water':
        // Bubbles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 6; i++) {
          const x = (i * 43) % size;
          const y = (i * 67) % size;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      
      case 'forest':
        // Tree silhouettes
        ctx.fillStyle = '#1a3010';
        for (let i = 0; i < 3; i++) {
          const x = i * 80 + 40;
          ctx.beginPath();
          ctx.arc(x, 60, 20, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      
      case 'poison':
        // Toxic bubbles
        ctx.fillStyle = 'rgba(139, 0, 139, 0.4)';
        for (let i = 0; i < 5; i++) {
          const x = (i * 51) % size;
          const y = (i * 73) % size;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      
      case 'ice':
        // Snowflakes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const x = (i * 60 + 30) % size;
          const y = (i * 50 + 40) % size;
          ctx.beginPath();
          ctx.moveTo(x - 6, y);
          ctx.lineTo(x + 6, y);
          ctx.moveTo(x, y - 6);
          ctx.lineTo(x, y + 6);
          ctx.stroke();
        }
        break;
      
      case 'powerplant':
        // Lightning bolt
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(size / 2, 20);
        ctx.lineTo(size / 2 - 10, 50);
        ctx.lineTo(size / 2 + 5, 50);
        ctx.lineTo(size / 2 - 5, 80);
        ctx.stroke();
        break;
      
      case 'night':
        // Stars and moon
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 8; i++) {
          const x = (i * 41) % size;
          const y = (i * 59) % size;
          ctx.fillRect(x, y, 3, 3);
        }
        // Moon
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(size - 40, 40, 15, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'dungeon':
        // Torches
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(30, 30, 8, 0, Math.PI * 2);
        ctx.arc(size - 30, 30, 8, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }

  createText(text, x, y, size, color, options = {}) {
    const sprite = this.game.fontLoader.createTextSprite(text, size, color, options);
    sprite.position.set(x, y, 0);
    this.scene.add(sprite);
    return sprite;
  }

  updateSelectionBorder() {
    const spacing = 130;
    const startX = -spacing * 2.5;
    const startY = 50;
    
    const col = this.selectedStage % this.gridCols;
    const row = Math.floor(this.selectedStage / this.gridCols);
    
    const x = startX + col * spacing;
    const y = startY - row * 140;
    
    this.selectionBorder.position.set(x, y, -1);
    this.borderOutline.position.set(x, y, 1);
    
    // Highlight selected stage text
    this.stageTexts.forEach((text, index) => {
      if (index === this.selectedStage) {
        text.material.color.setHex(0x00ff00);
      } else {
        text.material.color.setHex(0xffffff);
      }
    });
    
    // Update selected stage title display
    const selectedStage = GameConfig.STAGES[this.selectedStage];
    if (this.selectedStageTitle && selectedStage) {
      // Remove old sprite
      this.scene.remove(this.selectedStageTitle);
      
      // Create new text with updated stage name
      this.selectedStageTitle = this.createText(
        `${this.selectedStage + 1}. ${selectedStage.name}`,
        0, 180, 42, 0x00ff00, 
        { scaleX: 800, scaleY: 80 }
      );
    }
  }

  onEnter() {
    console.log('Entered Stage Select');
    this.selectedStage = 0;
    this.updateSelectionBorder();
  }

  onExit() {
    console.log('Exited Stage Select');
  }

  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Blinking animation for selection border
    if (this.borderOutline && this.borderOutline.material) {
      this.blinkTimer += deltaTime;
      const opacity = Math.abs(Math.sin(this.blinkTimer * 3)) * 0.5 + 0.5; // Blink between 0.5 and 1.0
      this.borderOutline.material.opacity = opacity;
    }
    
    // Navigation
    const oldSelection = this.selectedStage;
    
    // Left/Right navigation
    if (input.actions.left && !input.previousActions.left) {
      if (this.selectedStage % this.gridCols > 0) {
        this.selectedStage--;
      }
    }
    
    if (input.actions.right && !input.previousActions.right) {
      if (this.selectedStage % this.gridCols < this.gridCols - 1 && 
          this.selectedStage < GameConfig.STAGES.length - 1) {
        this.selectedStage++;
      }
    }
    
    // Up/Down navigation
    if (input.actions.up && !input.previousActions.up) {
      if (this.selectedStage >= this.gridCols) {
        this.selectedStage -= this.gridCols;
      }
    }
    
    if (input.actions.down && !input.previousActions.down) {
      if (this.selectedStage + this.gridCols < GameConfig.STAGES.length) {
        this.selectedStage += this.gridCols;
      }
    }
    
    // Update border if selection changed
    if (oldSelection !== this.selectedStage) {
      this.updateSelectionBorder();
    }
    
    // Confirm selection and start game
    if (input.isActionPressed()) {
      this.game.selectedStage = GameConfig.STAGES[this.selectedStage];
      this.game.sceneManager.switchTo('game');
    }
    
    // Back to character select
    if (input.isPausePressed()) {
      this.game.sceneManager.switchTo('characterSelect');
    }
  }
}
