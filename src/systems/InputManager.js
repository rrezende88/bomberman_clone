// InputManager handles both keyboard and gamepad input
export class InputManager {
  constructor() {
    this.keys = {};
    this.gamepad = null;
    this.gamepadIndex = -1;
    
    // Keyboard bindings
    this.keyBindings = {
      up: ['ArrowUp', 'KeyW'],
      down: ['ArrowDown', 'KeyS'],
      left: ['ArrowLeft', 'KeyA'],
      right: ['ArrowRight', 'KeyD'],
      action: ['Space', 'Enter'],
      pause: ['Escape', 'KeyP'],
    };
    
    // Action states
    this.actions = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
      actionPressed: false, // True only on first press
      pause: false,
      pausePressed: false,
    };
    
    this.previousActions = { ...this.actions };
    
    // Set up event listeners
    this.setupKeyboardListeners();
    this.setupGamepadListeners();
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  setupGamepadListeners() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      this.gamepadIndex = e.gamepad.index;
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('Gamepad disconnected');
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadIndex = -1;
        this.gamepad = null;
      }
    });
  }

  update() {
    // Store previous state for pressed detection
    this.previousActions = { ...this.actions };
    
    // Update keyboard input
    this.updateKeyboard();
    
    // Update gamepad input
    this.updateGamepad();
    
    // Detect "pressed" events (transition from false to true)
    this.actions.actionPressed = this.actions.action && !this.previousActions.action;
    this.actions.pausePressed = this.actions.pause && !this.previousActions.pause;
  }

  updateKeyboard() {
    // Check directional input
    this.actions.up = this.isKeyDown('up');
    this.actions.down = this.isKeyDown('down');
    this.actions.left = this.isKeyDown('left');
    this.actions.right = this.isKeyDown('right');
    this.actions.action = this.isKeyDown('action');
    this.actions.pause = this.isKeyDown('pause');
  }

  updateGamepad() {
    // Poll gamepad state
    if (this.gamepadIndex >= 0) {
      const gamepads = navigator.getGamepads();
      this.gamepad = gamepads[this.gamepadIndex];
      
      if (this.gamepad) {
        // D-pad and analog stick
        const axes = this.gamepad.axes;
        const buttons = this.gamepad.buttons;
        
        // Analog stick (with deadzone)
        const deadzone = 0.3;
        if (axes[0] < -deadzone) this.actions.left = true;
        if (axes[0] > deadzone) this.actions.right = true;
        if (axes[1] < -deadzone) this.actions.up = true;
        if (axes[1] > deadzone) this.actions.down = true;
        
        // D-pad (buttons 12-15 on standard gamepad)
        if (buttons[12] && buttons[12].pressed) this.actions.up = true;
        if (buttons[13] && buttons[13].pressed) this.actions.down = true;
        if (buttons[14] && buttons[14].pressed) this.actions.left = true;
        if (buttons[15] && buttons[15].pressed) this.actions.right = true;
        
        // A button (button 0) for action
        if (buttons[0] && buttons[0].pressed) this.actions.action = true;
        
        // Start button (button 9) for pause
        if (buttons[9] && buttons[9].pressed) this.actions.pause = true;
      }
    }
  }

  isKeyDown(action) {
    const keys = this.keyBindings[action];
    if (!keys) return false;
    
    return keys.some(key => this.keys[key]);
  }

  getDirection() {
    const dir = { x: 0, y: 0 };
    
    if (this.actions.left) dir.x -= 1;
    if (this.actions.right) dir.x += 1;
    if (this.actions.up) dir.y += 1;
    if (this.actions.down) dir.y -= 1;
    
    // Normalize diagonal movement
    if (dir.x !== 0 && dir.y !== 0) {
      const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
      dir.x /= length;
      dir.y /= length;
    }
    
    return dir;
  }

  isActionPressed() {
    return this.actions.actionPressed;
  }

  isPausePressed() {
    return this.actions.pausePressed;
  }

  isGamepadConnected() {
    return this.gamepadIndex >= 0;
  }
}
