/**
 * EnemyBehaviors - Defines enemy type properties and behaviors
 * Each enemy type has unique movement patterns and characteristics
 */

export const ENEMY_TYPES = {
  wanderer: { 
    baseSpeed: 1.0, 
    immuneToSlowdown: false,
    description: 'Slow enemy with random movement'
  },
  chaser: { 
    baseSpeed: 2.0, 
    immuneToSlowdown: false,
    description: 'Fast enemy that pursues the player'
  },
  patroller: { 
    baseSpeed: 1.5, 
    immuneToSlowdown: true,
    description: 'Medium speed enemy that follows patrol routes, immune to slowdowns'
  }
};

export const ENEMY_COUNT = 5;
