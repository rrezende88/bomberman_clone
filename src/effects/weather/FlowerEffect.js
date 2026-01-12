import { WeatherEffect } from './WeatherEffect.js';

/**
 * Flower petal effect (Brazilian Ipê)
 * Gentle floating petals with spiral motion
 */
export class FlowerEffect extends WeatherEffect {
  constructor(scene) {
    // Brazilian Ipê tree colors
    const ipeColors = [
      0xeec023, // Ipê-Amarelo (Yellow) variant 1
      0xf4c630, // Ipê-Amarelo (Yellow) variant 2
      0x7b679f, // Ipê-Roxo (Purple) variant 1
      0x766598, // Ipê-Roxo (Purple) variant 2
      0xcc75a5  // Ipê-Rosa (Pink)
    ];
    
    super(scene, {
      particleCount: 50,
      sizeRange: { min: 4, max: 10 },
      speedRange: { min: 15, max: 40 },
      colors: ipeColors, // Multi-color support
      opacity: { min: 0.7, max: 0.95 },
      zRange: { min: -0.8, max: 2 },
      shape: 'circle'
    });
  }
  
  /**
   * Update flower petal with floating, swaying motion
   * @param {Object} particle - Particle to update
   * @param {number} deltaTime - Time since last frame
   */
  updateParticle(particle, deltaTime) {
    // Gentle vertical fall (downward)
    particle.sprite.position.y += particle.velocityY * deltaTime;
    
    // Spiral/swaying horizontal movement
    const swayAmplitude = 25; // pixels per second
    const swayFrequency = 1.5; // oscillations per second
    const spiralPhase = particle.time * swayFrequency;
    
    // Combine sine and cosine for spiral effect
    particle.velocityX = Math.sin(spiralPhase) * swayAmplitude;
    particle.sprite.position.x += particle.velocityX * deltaTime;
    
    // Add secondary drift for more natural movement
    const secondaryDrift = Math.cos(spiralPhase * 0.7) * 10;
    particle.sprite.position.x += secondaryDrift * deltaTime;
    
    // Rotation for tumbling petal effect
    particle.rotation += particle.rotationSpeed * deltaTime * 2;
    particle.sprite.rotation.z = particle.rotation;
    
    // Slight scaling pulsing for flutter effect
    const scale = 1 + Math.sin(particle.time * 4) * 0.1;
    particle.sprite.scale.set(scale, scale, 1);
    
    // Gentle opacity variation
    const opacityVariation = Math.sin(particle.time * 2) * 0.15;
    particle.sprite.material.opacity = Math.max(0.3, particle.baseOpacity + opacityVariation);
  }
}
