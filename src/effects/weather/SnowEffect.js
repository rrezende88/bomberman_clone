import { WeatherEffect } from './WeatherEffect.js';

/**
 * Snow particle effect
 * Snowflakes falling gently with horizontal drift
 */
export class SnowEffect extends WeatherEffect {
  constructor(scene) {
    super(scene, {
      particleCount: 80,
      sizeRange: { min: 2, max: 8 },
      speedRange: { min: 20, max: 60 },
      color: 0xffffff,
      opacity: { min: 0.6, max: 0.9 },
      zRange: { min: -0.8, max: 2 },
      shape: 'circle'
    });
  }
  
  /**
   * Update snow particle with gentle drifting motion
   * @param {Object} particle - Particle to update
   * @param {number} deltaTime - Time since last frame
   */
  updateParticle(particle, deltaTime) {
    // Vertical fall (downward)
    particle.sprite.position.y += particle.velocityY * deltaTime;
    
    // Horizontal drift using sine wave
    const driftAmount = 15; // pixels per second
    const driftFrequency = 2; // oscillations per second
    particle.velocityX = Math.sin(particle.time * driftFrequency) * driftAmount;
    particle.sprite.position.x += particle.velocityX * deltaTime;
    
    // Slight rotation for tumbling effect
    particle.rotation += particle.rotationSpeed * deltaTime;
    particle.sprite.rotation.z = particle.rotation;
    
    // Subtle opacity pulsing for sparkle effect
    const opacityPulse = Math.sin(particle.time * 3) * 0.1;
    particle.sprite.material.opacity = particle.baseOpacity + opacityPulse;
  }
}
