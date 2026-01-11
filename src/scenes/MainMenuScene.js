import * as THREE from 'three';

export class MainMenuScene {
  constructor(game) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2a2a);
    
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
    
    // Create info section for selected option (moved down to avoid overlap)
    this.infoText = this.createText('', 0, -200, 32, 0xaaaaaa, { scaleX: 700, scaleY: 80 });
    
    // Create gamepad hint if connected
    this.gamepadHint = this.createText('', 0, -240, 28, 0xaaaaaa, { scaleX: 600, scaleY: 70 });
    
    // Create copyright/controls text (moved down further)
    this.createText('Arrow Keys / WASD - Navigate', 0, -270, 24, 0x888888, { scaleX: 600, scaleY: 60 });
    this.createText('Enter / Space - Select', 0, -295, 24, 0x888888, { scaleX: 600, scaleY: 60 });
  }

  createText(text, x, y, size, color, options = {}) {
    const sprite = this.game.fontLoader.createTextSprite(text, size, color, options);
    sprite.position.set(x, y, 0);
    this.scene.add(sprite);
    return sprite;
  }

  updateMenuHighlight() {
    // Descriptions for each menu option
    const descriptions = [
      'Begin your bombing adventure!',
      'View control scheme & gamepad setup',
      'Close the game'
    ];
    
    this.menuItems.forEach((item, index) => {
      const isSelected = index === this.selectedOption;
      const color = isSelected ? 0x00ff00 : 0xffffff;
      const text = isSelected ? `> ${this.options[index]} <` : this.options[index];
      
      this.game.fontLoader.updateTextSprite(item, text, 42, color);
    });
    
    // Update info text with description of selected option
    if (this.infoText) {
      this.game.fontLoader.updateTextSprite(
        this.infoText, 
        descriptions[this.selectedOption], 
        32, 
        0xaaaaaa
      );
    }
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
