import { KeyboardController } from '../controllers/KeyboardController.js';
import { GamepadController } from '../controllers/GamepadController.js';
import { TouchController } from '../controllers/TouchController.js';

// InputManager orchestrates all input controllers
export class InputManager {
  constructor() {
    // Action states (shared by all controllers)
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
    
    // Initialize controllers (KeyboardController is default, always enabled)
    this.keyboardController = new KeyboardController(this.actions);
    this.gamepadController = new GamepadController(this.actions);
    this.touchController = new TouchController(this.actions);
  }

  update() {
    // Store previous state for pressed detection
    this.previousActions = { ...this.actions };
    
    // Reset actions before updating
    this.resetActions();
    
    // Update all controllers (they apply to shared actions using OR logic)
    this.keyboardController.update();
    this.gamepadController.update();
    this.touchController.update();
    
    // Detect "pressed" events (transition from false to true)
    this.detectPressedEvents();
  }

  resetActions() {
    this.actions.up = false;
    this.actions.down = false;
    this.actions.left = false;
    this.actions.right = false;
    this.actions.action = false;
    this.actions.pause = false;
  }

  detectPressedEvents() {
    this.actions.actionPressed = this.actions.action && !this.previousActions.action;
    this.actions.pausePressed = this.actions.pause && !this.previousActions.pause;
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
    return this.gamepadController.isEnabled();
  }

  isTouchDevice() {
    return this.touchController.isEnabled();
  }

  getTouchController() {
    return this.touchController;
  }
}
