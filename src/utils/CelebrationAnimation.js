import { GameConfig } from './GameConfig.js';

/**
 * Reusable celebration animation for character sprites
 * Shows the character with raised arms (frameY=4) with bouncing and frame cycling
 */
export class CelebrationAnimation {
  constructor(sprite, spriteSheet, spriteLoader) {
    this.sprite = sprite;
    this.spriteSheet = spriteSheet;
    this.spriteLoader = spriteLoader;
    this.animationFrame = 0;
    this.baseY = sprite.position.y;
  }

  /**
   * Update the celebration animation
   * @param {number} deltaTime - Time since last frame
   * @param {number} timer - Overall timer for animation timing
   * @returns {boolean} - True if animation is active
   */
  update(deltaTime, timer) {
    if (!this.sprite || !this.spriteSheet) {
      return false;
    }

    // Bounce animation
    const bounceOffset = Math.abs(Math.sin(timer * 5)) * 10;
    this.sprite.position.y = this.baseY + bounceOffset;

    // Animate sprite frames (cycle through celebration frames)
    const frameSpeed = 0.15;
    this.animationFrame += deltaTime / frameSpeed;
    const currentFrame = Math.floor(this.animationFrame) % 4; // 4 frames

    // Update texture with new frame
    const newTexture = this.spriteLoader.createAnimatedCharacterTexture(
      this.spriteSheet,
      currentFrame, // Cycle through frames 0-3
      4, // frameY = 4 (celebration with raised arms)
      GameConfig.SPRITE_SIZE
    );
    this.sprite.material.map = newTexture;
    this.sprite.material.needsUpdate = true;

    return true;
  }

  /**
   * Reset the base Y position (useful if sprite moved)
   */
  updateBaseY() {
    this.baseY = this.sprite.position.y;
  }

  /**
   * Set the sprite to celebration pose without animation
   */
  setInitialPose() {
    if (!this.sprite || !this.spriteSheet) {
      return;
    }

    const texture = this.spriteLoader.createAnimatedCharacterTexture(
      this.spriteSheet,
      0, // First frame
      4, // frameY = 4 (celebration with raised arms)
      GameConfig.SPRITE_SIZE
    );
    this.sprite.material.map = texture;
    this.sprite.material.needsUpdate = true;
  }

  /**
   * Clean up animation
   */
  dispose() {
    this.sprite = null;
    this.spriteSheet = null;
    this.spriteLoader = null;
  }
}
