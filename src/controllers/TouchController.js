// TouchController handles touch input for mobile devices
export class TouchController {
  constructor(actions) {
    this.actions = actions;
    this.enabled = this.detectTouchDevice();
    
    // Internal touch state (modified by event handlers)
    this.touchActions = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
      pause: false
    };
    
    // Touch tracking
    this.touches = new Map(); // Map touch identifier to touch data
    this.joystickTouch = null;
    this.actionButtonTouch = null;
    this.pauseButtonTouch = null;
    
    // Joystick configuration
    this.joystick = {
      baseX: 0,
      baseY: 0,
      stickX: 0,
      stickY: 0,
      maxRadius: 60, // Maximum stick movement radius
      deadzone: 0.2, // 20% deadzone
      active: false
    };
    
    // Button zones (will be set by TouchUI)
    this.buttonZones = {
      joystick: { x: 0, y: 0, radius: 80 },
      action: { x: 0, y: 0, radius: 40 },
      pause: { x: 0, y: 0, radius: 30 }
    };
    
    if (this.enabled) {
      this.setupTouchListeners();
    }
  }
  
  detectTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }
  
  setupTouchListeners() {
    // Prevent default behaviors
    document.addEventListener('touchmove', (e) => {
      // Prevent scrolling
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
    document.addEventListener('touchcancel', (e) => this.onTouchCancel(e), { passive: false });
  }
  
  onTouchStart(e) {
    e.preventDefault();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Check which zone was touched
      if (this.isInZone(x, y, this.buttonZones.joystick)) {
        // Joystick touch
        this.joystickTouch = touch.identifier;
        this.joystick.active = true;
        this.joystick.baseX = this.buttonZones.joystick.x;
        this.joystick.baseY = this.buttonZones.joystick.y;
        this.updateJoystick(x, y);
      } else if (this.isInZone(x, y, this.buttonZones.action)) {
        // Action button touch
        this.actionButtonTouch = touch.identifier;
        this.touchActions.action = true;
      } else if (this.isInZone(x, y, this.buttonZones.pause)) {
        // Pause button touch
        this.pauseButtonTouch = touch.identifier;
        this.touchActions.pause = true;
      }
    }
  }
  
  onTouchMove(e) {
    e.preventDefault();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      
      if (touch.identifier === this.joystickTouch) {
        this.updateJoystick(touch.clientX, touch.clientY);
      }
    }
  }
  
  onTouchEnd(e) {
    e.preventDefault();
    
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      
      if (touch.identifier === this.joystickTouch) {
        // Reset joystick
        this.joystickTouch = null;
        this.joystick.active = false;
        this.joystick.stickX = 0;
        this.joystick.stickY = 0;
        this.resetDirections();
      } else if (touch.identifier === this.actionButtonTouch) {
        // Release action button
        this.actionButtonTouch = null;
        this.touchActions.action = false;
      } else if (touch.identifier === this.pauseButtonTouch) {
        // Release pause button
        this.pauseButtonTouch = null;
        this.touchActions.pause = false;
      }
    }
  }
  
  onTouchCancel(e) {
    // Treat cancel same as end
    this.onTouchEnd(e);
  }
  
  updateJoystick(touchX, touchY) {
    // Calculate offset from base
    const dx = touchX - this.joystick.baseX;
    const dy = touchY - this.joystick.baseY;
    
    // Calculate distance and angle
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Clamp to max radius
    const clampedDistance = Math.min(distance, this.joystick.maxRadius);
    
    // Update stick position
    this.joystick.stickX = Math.cos(angle) * clampedDistance;
    this.joystick.stickY = Math.sin(angle) * clampedDistance;
    
    // Calculate normalized direction (0-1 range)
    const normalizedDistance = clampedDistance / this.joystick.maxRadius;
    
    // Apply deadzone
    if (normalizedDistance < this.joystick.deadzone) {
      this.resetDirections();
      return;
    }
    
    // Calculate directional input with adjusted range after deadzone
    const adjustedDistance = (normalizedDistance - this.joystick.deadzone) / (1 - this.joystick.deadzone);
    const dirX = Math.cos(angle) * adjustedDistance;
    const dirY = Math.sin(angle) * adjustedDistance;
    
    // Convert to 8-directional input with analog precision
    // Use a threshold to determine when a direction is active
    const threshold = 0.3;
    
    this.touchActions.left = dirX < -threshold;
    this.touchActions.right = dirX > threshold;
    this.touchActions.up = dirY < -threshold; // Y is inverted in screen coords
    this.touchActions.down = dirY > threshold;
  }
  
  resetDirections() {
    this.touchActions.up = false;
    this.touchActions.down = false;
    this.touchActions.left = false;
    this.touchActions.right = false;
  }
  
  isInZone(x, y, zone) {
    const dx = x - zone.x;
    const dy = y - zone.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= zone.radius;
  }
  
  setButtonZone(buttonName, x, y, radius) {
    if (this.buttonZones[buttonName]) {
      this.buttonZones[buttonName] = { x, y, radius };
    }
  }
  
  update() {
    // Apply touch state to actions (same timing as keyboard/gamepad)
    // Use OR logic to merge with other input methods
    this.actions.up = this.actions.up || this.touchActions.up;
    this.actions.down = this.actions.down || this.touchActions.down;
    this.actions.left = this.actions.left || this.touchActions.left;
    this.actions.right = this.actions.right || this.touchActions.right;
    this.actions.action = this.actions.action || this.touchActions.action;
    this.actions.pause = this.actions.pause || this.touchActions.pause;
  }
  
  isEnabled() {
    return this.enabled;
  }
  
  getJoystickState() {
    return {
      active: this.joystick.active,
      baseX: this.joystick.baseX,
      baseY: this.joystick.baseY,
      stickX: this.joystick.stickX,
      stickY: this.joystick.stickY,
      maxRadius: this.joystick.maxRadius
    };
  }
  
  isActionButtonPressed() {
    return this.actionButtonTouch !== null;
  }
  
  isPauseButtonPressed() {
    return this.pauseButtonTouch !== null;
  }
}
