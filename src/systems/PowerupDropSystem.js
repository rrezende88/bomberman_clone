import { POWERUP_TYPES, POWERUP_DROP_RATES } from '../parameters/PowerupBehaviors.js';

/**
 * PowerupDropSystem - Manages powerup drop logic for walls and enemies
 * Centralizes all random drop determination and type selection
 */
export class PowerupDropSystem {
  constructor() {
    // System is stateless, all configuration comes from PowerupBehaviors
  }

  /**
   * Determine if a soft wall should contain a powerup
   * @returns {Object} { shouldDrop: boolean, type: string|null }
   */
  rollWallPowerup() {
    const shouldDrop = Math.random() < POWERUP_DROP_RATES.wall;
    
    if (shouldDrop) {
      return {
        shouldDrop: true,
        type: this.selectPowerupType()
      };
    }
    
    return {
      shouldDrop: false,
      type: null
    };
  }

  /**
   * Determine if an enemy should drop a powerup on death
   * @returns {Object} { shouldDrop: boolean, type: string|null }
   */
  rollEnemyPowerup() {
    const shouldDrop = Math.random() < POWERUP_DROP_RATES.enemy;
    
    if (shouldDrop) {
      return {
        shouldDrop: true,
        type: this.selectPowerupType()
      };
    }
    
    return {
      shouldDrop: false,
      type: null
    };
  }

  /**
   * Randomly select a powerup type from available types
   * @returns {string} The selected powerup type
   */
  selectPowerupType() {
    const randomIndex = Math.floor(Math.random() * POWERUP_TYPES.length);
    return POWERUP_TYPES[randomIndex];
  }
}
