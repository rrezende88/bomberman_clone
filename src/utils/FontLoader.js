import * as THREE from 'three';

/**
 * FontLoader - Utility for creating retro arcade-style text textures
 * Uses Capcom Fighting game style font for authentic arcade aesthetic
 */
export class FontLoader {
  constructor() {
    this.fontFamily = '"Press Start 2P", "Arial Black", sans-serif';
    this.fontLoaded = false;
    this.loadFont();
  }

  loadFont() {
    // Load Press Start 2P font from Google Fonts
    if (!document.getElementById('arcade-font-link')) {
      const link = document.createElement('link');
      link.id = 'arcade-font-link';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
      document.head.appendChild(link);
    }

    // Wait for font to load
    if (document.fonts) {
      document.fonts.load('12px "Press Start 2P"').then(() => {
        this.fontLoaded = true;
        console.log('Capcom-style font loaded successfully');
      }).catch(err => {
        console.warn('Font loading failed, using fallback:', err);
        this.fontLoaded = true;
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        this.fontLoaded = true;
      }, 1000);
    }
  }

  async init() {
    // Wait for font to be loaded
    return new Promise((resolve) => {
      const checkFont = () => {
        if (this.fontLoaded) {
          resolve();
        } else {
          setTimeout(checkFont, 50);
        }
      };
      checkFont();
    });
  }

  /**
   * Create a text texture with arcade-style font
   * @param {string} text - The text to render
   * @param {number} size - Font size in pixels
   * @param {number} color - Color in hex format (e.g., 0xff0000)
   * @param {Object} options - Additional options
   * @returns {THREE.CanvasTexture}
   */
  createTextTexture(text, size, color, options = {}) {
    const {
      strokeColor = 0x000000,
      strokeWidth = 6,
      canvasWidth = 1024,
      canvasHeight = 256,
      align = 'center',
      baseline = 'middle',
      maxWidth = null,
      shadow = true
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Setup font - Capcom/arcade style
    ctx.font = `${size}px ${this.fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    // Calculate position
    let x = align === 'center' ? canvasWidth / 2 : align === 'right' ? canvasWidth - 10 : 10;
    let y = baseline === 'middle' ? canvasHeight / 2 : baseline === 'top' ? 10 : canvasHeight - 10;

    // Draw shadow for depth (Capcom style)
    if (shadow) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      if (maxWidth) {
        ctx.fillText(text, x + 3, y + 3, maxWidth);
      } else {
        ctx.fillText(text, x + 3, y + 3);
      }
    }

    // Draw thick outer stroke (double layer for extra boldness)
    if (strokeWidth > 0) {
      ctx.strokeStyle = `#${strokeColor.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = strokeWidth + 2;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      if (maxWidth) {
        ctx.strokeText(text, x, y, maxWidth);
      } else {
        ctx.strokeText(text, x, y);
      }
      
      // Second pass for extra thickness
      ctx.lineWidth = strokeWidth;
      if (maxWidth) {
        ctx.strokeText(text, x, y, maxWidth);
      } else {
        ctx.strokeText(text, x, y);
      }
    }

    // Draw text fill
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    if (maxWidth) {
      ctx.fillText(text, x, y, maxWidth);
    } else {
      ctx.fillText(text, x, y);
    }

    // Create THREE.js texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Create a text sprite ready to add to scene
   * @param {string} text - The text to render
   * @param {number} size - Font size in pixels
   * @param {number} color - Color in hex format
   * @param {Object} options - Additional options
   * @returns {THREE.Sprite}
   */
  createTextSprite(text, size, color, options = {}) {
    const {
      scaleX = 200,
      scaleY = 50,
      ...textureOptions
    } = options;

    const texture = this.createTextTexture(text, size, color, textureOptions);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scaleX, scaleY, 1);

    return sprite;
  }

  /**
   * Update existing sprite with new text
   * @param {THREE.Sprite} sprite - The sprite to update
   * @param {string} text - New text content
   * @param {number} size - Font size
   * @param {number} color - Text color
   * @param {Object} options - Additional options
   */
  updateTextSprite(sprite, text, size, color, options = {}) {
    const texture = this.createTextTexture(text, size, color, options);
    
    if (sprite.material.map) {
      sprite.material.map.dispose();
    }
    
    sprite.material.map = texture;
    sprite.material.needsUpdate = true;
  }

  /**
   * Create a health bar texture
   * @param {number} current - Current health value
   * @param {number} max - Maximum health value
   * @param {number} width - Bar width in pixels
   * @param {number} height - Bar height in pixels
   * @returns {THREE.CanvasTexture}
   */
  createHealthBarTexture(current, max, width = 200, height = 30) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    // Calculate health percentage
    const percentage = Math.max(0, Math.min(1, current / max));
    
    // Determine bar color based on health
    let barColor;
    if (percentage > 0.6) {
      barColor = '#00ff00'; // Green
    } else if (percentage > 0.3) {
      barColor = '#ffff00'; // Yellow
    } else {
      barColor = '#ff0000'; // Red
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw HP label with Capcom style
    ctx.font = `28px ${this.fontFamily}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Label shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText('HP', centerX - width / 2 - 10 + 2, centerY + 2);
    
    // Label outline (double pass for thickness)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText('HP', centerX - width / 2 - 10, centerY);
    ctx.lineWidth = 4;
    ctx.strokeText('HP', centerX - width / 2 - 10, centerY);
    
    // Label fill
    ctx.fillStyle = '#ffffff';
    ctx.fillText('HP', centerX - width / 2 - 10, centerY);

    // Draw background bar (dark)
    ctx.fillStyle = '#333333';
    ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);

    // Draw health bar (colored)
    const healthWidth = width * percentage;
    ctx.fillStyle = barColor;
    ctx.fillRect(centerX - width / 2, centerY - height / 2, healthWidth, height);

    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);

    // Draw health text with Capcom style
    ctx.font = `22px ${this.fontFamily}`;
    ctx.textAlign = 'center';
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(`${Math.ceil(current)}/${max}`, centerX + 2, centerY + 2);
    
    // Outline (double pass)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText(`${Math.ceil(current)}/${max}`, centerX, centerY);
    ctx.lineWidth = 4;
    ctx.strokeText(`${Math.ceil(current)}/${max}`, centerX, centerY);
    
    // Fill
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(current)}/${max}`, centerX, centerY);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    return texture;
  }
}
