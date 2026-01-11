/**
 * PowerupBehaviors - Defines powerup properties and drop rates
 * Each powerup type has unique effects and configurable drop rates
 */

export const POWERUP_TYPES = ['bomb', 'fire', 'speed'];

export const POWERUP_DROP_RATES = {
  wall: 0.3,    // 30% chance for soft walls to contain powerup
  enemy: 0.3,   // 30% chance for enemies to drop powerup
};

export const POWERUP_EFFECTS = {
  bomb: { property: 'maxBombs', modifier: 1 },
  fire: { property: 'bombRange', modifier: 1 },
  speed: { property: 'speed', modifier: 0.5 },
};
