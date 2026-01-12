import { WeatherEffect } from './WeatherEffect.js';

/**
 * Rain particle effect
 * Fast-falling raindrops with minimal horizontal drift
 */
export class RainEffect extends WeatherEffect {
  constructor(scene) {
    super(scene, {
      particleCount: 360,
      sizeRange: { min: 2, max: 2 }, // Consistent width for rain
      speedRange: { min: 150, max: 700 },
      color: 0x1d1f66,
      opacity: { min: 0.3, max: 0.6 },
      zRange: { min: -0.8, max: 2 },
      shape: 'line',
      lineHeight: 12 // Elongated raindrop shape
    });
  }
  
  /**
   * Update rain particle with fast downward motion
   * @param {Object} particle - Particle to update
   * @param {number} deltaTime - Time since last frame
   */
  updateParticle(particle, deltaTime) {
    // Fast vertical fall (downward)
    particle.sprite.position.y += particle.velocityY * deltaTime;
    
    // Minimal horizontal drift for wind effect
    const windDrift = 5; // pixels per second
    particle.velocityX = Math.sin(particle.time * 0.5) * windDrift;
    particle.sprite.position.x += particle.velocityX * deltaTime;
    
    // Slight angle to simulate falling direction
    const angle = Math.atan2(particle.velocityY, particle.velocityX);
    particle.sprite.rotation.z = angle - Math.PI / 2;
    
    // Vary opacity based on depth (closer = more visible)
    const depthFactor = (particle.sprite.position.z + 1) / 3; // Normalize z to 0-1
    particle.sprite.material.opacity = particle.baseOpacity * (0.5 + depthFactor * 0.5);
  }
}
