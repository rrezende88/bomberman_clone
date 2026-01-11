// GamepadController handles gamepad input
export class GamepadController {
  constructor(actions) {
    this.actions = actions;
    this.gamepad = null;
    this.gamepadIndex = -1;
    
    this.setupListeners();
  }
  
  setupListeners() {
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
    // Poll gamepad state
    if (this.gamepadIndex >= 0) {
      const gamepads = navigator.getGamepads();
      this.gamepad = gamepads[this.gamepadIndex];
      
      if (this.gamepad) {
        // D-pad and analog stick
        const axes = this.gamepad.axes;
        const buttons = this.gamepad.buttons;
        
        // Analog stick (with deadzone) - use OR to merge with keyboard/touch
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
  
  isEnabled() {
    return this.gamepadIndex >= 0;
  }
}
