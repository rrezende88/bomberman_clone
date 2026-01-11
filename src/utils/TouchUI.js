// TouchUI creates and manages the visual touch controls overlay
export class TouchUI {
  constructor(touchController) {
    this.touchController = touchController;
    this.container = null;
    this.joystickBase = null;
    this.joystickStick = null;
    this.actionButton = null;
    this.pauseButton = null;
    
    if (this.touchController.isEnabled()) {
      this.createUI();
      this.updateButtonZones();
      this.startRenderLoop();
      
      // Update button zones on window resize
      window.addEventListener('resize', () => this.updateButtonZones());
    }
  }
  
  createUI() {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'touch-controls';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      user-select: none;
      -webkit-user-select: none;
    `;
    
    // Create joystick base
    this.joystickBase = document.createElement('div');
    this.joystickBase.className = 'joystick-base';
    this.joystickBase.style.cssText = `
      position: absolute;
      left: 80px;
      bottom: 100px;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      border: 2px solid rgba(255,255,255,0.3);
      pointer-events: auto;
      transform: translate(-50%, 50%);
      transition: opacity 0.2s;
    `;
    
    // Create joystick stick
    this.joystickStick = document.createElement('div');
    this.joystickStick.className = 'joystick-stick';
    this.joystickStick.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%);
      border: 2px solid rgba(255,255,255,0.5);
      transform: translate(-50%, -50%);
      transition: opacity 0.2s;
    `;
    
    this.joystickBase.appendChild(this.joystickStick);
    
    // Create action button
    this.actionButton = document.createElement('div');
    this.actionButton.className = 'action-button';
    this.actionButton.style.cssText = `
      position: absolute;
      right: 80px;
      bottom: 100px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,100,100,0.4) 0%, rgba(255,100,100,0.2) 100%);
      border: 2px solid rgba(255,255,255,0.5);
      pointer-events: auto;
      transform: translate(50%, 50%);
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      color: rgba(255,255,255,0.8);
    `;
    this.actionButton.innerHTML = '💣';
    
    // Create pause button
    this.pauseButton = document.createElement('div');
    this.pauseButton.className = 'pause-button';
    this.pauseButton.style.cssText = `
      position: absolute;
      right: 30px;
      top: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%);
      border: 2px solid rgba(255,255,255,0.4);
      pointer-events: auto;
      transform: translate(0, 0);
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: rgba(255,255,255,0.8);
    `;
    this.pauseButton.innerHTML = '⏸';
    
    // Add all elements to container
    this.container.appendChild(this.joystickBase);
    this.container.appendChild(this.actionButton);
    this.container.appendChild(this.pauseButton);
    
    // Add to document
    document.body.appendChild(this.container);
    
    // Set initial opacity
    this.setOpacity(0.4);
  }
  
  updateButtonZones() {
    if (!this.joystickBase || !this.actionButton || !this.pauseButton) return;
    
    // Get positions of visual elements
    const joystickRect = this.joystickBase.getBoundingClientRect();
    const actionRect = this.actionButton.getBoundingClientRect();
    const pauseRect = this.pauseButton.getBoundingClientRect();
    
    // Update touch controller zones
    this.touchController.setButtonZone(
      'joystick',
      joystickRect.left + joystickRect.width / 2,
      joystickRect.top + joystickRect.height / 2,
      80 // Touch radius
    );
    
    this.touchController.setButtonZone(
      'action',
      actionRect.left + actionRect.width / 2,
      actionRect.top + actionRect.height / 2,
      40 // Touch radius
    );
    
    this.touchController.setButtonZone(
      'pause',
      pauseRect.left + pauseRect.width / 2,
      pauseRect.top + pauseRect.height / 2,
      30 // Touch radius
    );
  }
  
  startRenderLoop() {
    const update = () => {
      this.updateVisuals();
      requestAnimationFrame(update);
    };
    update();
  }
  
  updateVisuals() {
    if (!this.touchController.isEnabled()) return;
    
    const joystickState = this.touchController.getJoystickState();
    
    // Update joystick stick position
    if (joystickState.active) {
      this.joystickStick.style.transform = `translate(calc(-50% + ${joystickState.stickX}px), calc(-50% + ${joystickState.stickY}px))`;
      this.setOpacity(0.8);
    } else {
      this.joystickStick.style.transform = 'translate(-50%, -50%)';
      this.setOpacity(0.4);
    }
    
    // Update action button appearance
    if (this.touchController.isActionButtonPressed()) {
      this.actionButton.style.background = 'radial-gradient(circle, rgba(255,100,100,0.7) 0%, rgba(255,100,100,0.4) 100%)';
    } else {
      this.actionButton.style.background = 'radial-gradient(circle, rgba(255,100,100,0.4) 0%, rgba(255,100,100,0.2) 100%)';
    }
    
    // Update pause button appearance
    if (this.touchController.isPauseButtonPressed()) {
      this.pauseButton.style.background = 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%)';
    } else {
      this.pauseButton.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)';
    }
  }
  
  setOpacity(opacity) {
    if (this.joystickBase) {
      this.joystickBase.style.opacity = opacity;
    }
    if (this.actionButton) {
      this.actionButton.style.opacity = opacity;
    }
    if (this.pauseButton) {
      this.pauseButton.style.opacity = opacity;
    }
  }
  
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
  
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
  
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
