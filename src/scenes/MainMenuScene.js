import * as THREE from 'three';

export class MainMenuScene {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb0e0e6);
    
    this.selectedOption = 0;
    this.options = ['Start Game', 'Controls', 'Exit'];
    this.menuItems = [];
    
    this.createMenu();
  }

  createMenu() {
    // Create title
    this.createText('BOMBERMAN', 0, 150, 72, 0xffff00, { scaleX: 600, scaleY: 120 });
    this.createText('CLONE', 0, 80, 48, 0xffff00, { scaleX: 400, scaleY: 80 });
    
    // Create menu options
    const startY = 0;
    const spacing = 60;
    
    this.options.forEach((option, index) => {
      const y = startY - (index * spacing);
      const textMesh = this.createText(option, 0, y, 42, 0xffffff, { scaleX: 400, scaleY: 80 });
      this.menuItems.push(textMesh);
    });
    
    // Create gamepad hint if connected
    this.gamepadHint = this.createText('', 0, -180, 28, 0xaaaaaa, { scaleX: 900, scaleY: 100 });
    
    // Create orientation hint for touch devices (initially hidden)
    this.orientationHint = this.createText('', 0, -260, 26, 0xffaa00, { scaleX: 800, scaleY: 70 });
    this.orientationHint.visible = false;
    
    // Create copyright/controls text (moved down further)
    this.createText('Arrow Keys / WASD - Navigate', 0, -210, 24, 0x888888, { scaleX: 700, scaleY: 80 });
    this.createText('Enter / Space - Select', 0, -235, 24, 0x888888, { scaleX: 700, scaleY: 80 });
  }

  createText(text, x, y, size, color, options = {}) {
    const sprite = this.game.fontLoader.createTextSprite(text, size, color, options);
    sprite.position.set(x, y, 0);
    this.scene.add(sprite);
    return sprite;
  }

  updateMenuHighlight() {
    this.menuItems.forEach((item, index) => {
      const isSelected = index === this.selectedOption;
      const color = isSelected ? 0x00ff00 : 0xffffff;
      const text = isSelected ? `> ${this.options[index]} <` : this.options[index];
      
      this.game.fontLoader.updateTextSprite(item, text, 42, color);
    });
  }

  onEnter() {
    console.log('Entered Main Menu');
    this.selectedOption = 0;
    this.updateMenuHighlight();
  }

  onExit() {
    console.log('Exited Main Menu');
  }

  update(deltaTime) {
    const input = this.game.inputManager;
    
    // Update gamepad hint
    if (this.gamepadHint) {
      const text = input.isGamepadConnected() 
        ? 'Gamepad Connected!' 
        : 'Connect gamepad for controller support';
      
      if (this.gamepadHint.userData.text !== text) {
        this.gamepadHint.userData.text = text;
        this.game.fontLoader.updateTextSprite(this.gamepadHint, text, 28, 0xaaaaaa);
      }
    }
    
    // Update orientation hint for touch devices
    if (this.orientationHint) {
      const isTouchDevice = input.isTouchDevice();
      const isLandscape = window.innerWidth > window.innerHeight;
      const shouldShowHint = isTouchDevice && isLandscape;
      
      if (shouldShowHint && !this.orientationHint.visible) {
        this.orientationHint.visible = true;
        const text = 'Rotate to portrait for better experience';
        this.game.fontLoader.updateTextSprite(this.orientationHint, text, 26, 0xffaa00);
      } else if (!shouldShowHint && this.orientationHint.visible) {
        this.orientationHint.visible = false;
      }
    }
    
    // Navigation
    if (input.actions.up && !input.previousActions.up) {
      this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
      this.updateMenuHighlight();
    }
    
    if (input.actions.down && !input.previousActions.down) {
      this.selectedOption = (this.selectedOption + 1) % this.options.length;
      this.updateMenuHighlight();
    }
    
    // Selection
    if (input.isActionPressed()) {
      this.selectOption();
    }
  }

  selectOption() {
    switch (this.selectedOption) {
      case 0: // Start Game
        this.game.sceneManager.switchTo('characterSelect');
        break;
      case 1: // Controls
        alert('Controls:\n\nMovement: Arrow Keys or WASD\nPlace Bomb: Space or Enter\n\nGamepad: D-pad/Analog Stick + A Button');
        break;
      case 2: // Exit
        if (confirm('Exit game?')) {
          window.close();
        }
        break;
    }
  }
}
