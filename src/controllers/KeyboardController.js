// KeyboardController handles keyboard input
export class KeyboardController {
  constructor(actions) {
    this.actions = actions;
    this.keys = {};
    
    // Keyboard bindings
    this.keyBindings = {
      up: ['ArrowUp', 'KeyW'],
      down: ['ArrowDown', 'KeyS'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
      action: ['Space', 'Enter'],
      pause: ['Escape', 'KeyP'],
    };
    
    this.setupListeners();
  }
  
  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  update() {
    // Apply keyboard input to actions (use OR to merge with other inputs)
    this.actions.up = this.actions.up || this.isKeyDown('up');
    this.actions.down = this.actions.down || this.isKeyDown('down');
    this.actions.left = this.actions.left || this.isKeyDown('left');
    this.actions.right = this.actions.right || this.isKeyDown('right');
    this.actions.action = this.actions.action || this.isKeyDown('action');
    this.actions.pause = this.actions.pause || this.isKeyDown('pause');
  }
  
  isKeyDown(action) {
    const keys = this.keyBindings[action];
    if (!keys) return false;
    
    return keys.some(key => this.keys[key]);
  }
  
  isEnabled() {
    return true; // Keyboard is always enabled (default input method)
  }
}
