import * as THREE from 'three';
import { GameConfig } from '../../parameters/GameConfig.js';

/**
 * Base class for weather particle effects
 * Provides common particle management and lifecycle
 */
export class WeatherEffect {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.particles = [];
    
    // Merge provided config with defaults
    this.config = {
      particleCount: config.particleCount || 80,
      sizeRange: config.sizeRange || { min: 2, max: 8 },
      speedRange: config.speedRange || { min: 20, max: 60 },
      color: config.color || 0xffffff,
      colors: config.colors || null, // For multi-color effects
      opacity: config.opacity || { min: 0.6, max: 0.9 },
      zRange: config.zRange || { min: -0.8, max: 2 },
      shape: config.shape || 'circle', // 'circle' or 'line'
      lineHeight: config.lineHeight || 10, // For line shapes
      ...config
    };
    
    // Calculate game area bounds
    this.bounds = {
      width: GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE,
      height: GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE,
      left: -this.getHalfWidth(),
      right: this.getHalfWidth(),
      top: this.getHalfHeight(),
      bottom: -this.getHalfHeight()
    };
    
    this.createParticles();
  }
  
  getHalfWidth() {
    return (GameConfig.GRID_WIDTH * GameConfig.TILE_SIZE) / 2;
  }
  
  getHalfHeight() {
    return (GameConfig.GRID_HEIGHT * GameConfig.TILE_SIZE) / 2;
  }
  
  /**
   * Create all particle sprites
   */
  createParticles() {
    for (let i = 0; i < this.config.particleCount; i++) {
      const particle = this.createParticle();
      this.particles.push(particle);
      this.scene.add(particle.sprite);
    }
  }
  
  /**
   * Create a single particle with random properties
   */
  createParticle() {
    const size = this.randomRange(this.config.sizeRange.min, this.config.sizeRange.max);
    const speed = this.randomRange(this.config.speedRange.min, this.config.speedRange.max);
    const opacity = this.randomRange(this.config.opacity.min, this.config.opacity.max);
    const z = this.randomRange(this.config.zRange.min, this.config.zRange.max);
    
    // Determine color
    let color;
    if (this.config.colors && Array.isArray(this.config.colors)) {
      // Pick random color from array
      color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    } else {
      color = this.config.color;
    }
    
    // Create geometry based on shape
    let geometry;
    if (this.config.shape === 'line') {
      geometry = new THREE.PlaneGeometry(size / 4, this.config.lineHeight);
    } else {
      geometry = new THREE.CircleGeometry(size / 2, 8);
    }
    
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random starting position
    mesh.position.x = this.randomRange(this.bounds.left - 50, this.bounds.right + 50);
    mesh.position.y = this.randomRange(this.bounds.bottom - 50, this.bounds.top + 50);
    mesh.position.z = z;
    
    return {
      sprite: mesh,
      size: size,
      speed: speed,
      baseOpacity: opacity,
      velocityX: 0,
      velocityY: -speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: this.randomRange(-1, 1),
      time: Math.random() * 100, // Random phase for animations
      color: color
    };
  }
  
  /**
   * Update all particles
   * @param {number} deltaTime - Time since last frame in seconds
   */
  update(deltaTime) {
    for (const particle of this.particles) {
      particle.time += deltaTime;
      this.updateParticle(particle, deltaTime);
      this.checkBounds(particle);
    }
  }
  
  /**
   * Update individual particle - to be overridden by subclasses
   * @param {Object} particle - Particle to update
   * @param {number} deltaTime - Time since last frame
   */
  updateParticle(particle, deltaTime) {
    // Default behavior: simple downward fall
    particle.sprite.position.y += particle.velocityY * deltaTime;
  }
  
  /**
   * Check if particle is out of bounds and recycle if needed
   * @param {Object} particle - Particle to check
   */
  checkBounds(particle) {
    // Check if particle has fallen below the visible area
    if (particle.sprite.position.y < this.bounds.bottom - 50) {
      this.recycleParticle(particle);
    }
    
    // Also check horizontal bounds (for wind effects)
    if (particle.sprite.position.x < this.bounds.left - 100 || 
        particle.sprite.position.x > this.bounds.right + 100) {
      this.recycleParticle(particle);
    }
  }
  
  /**
   * Reset particle to starting position
   * @param {Object} particle - Particle to recycle
   */
  recycleParticle(particle) {
    // Reset to top of screen
    particle.sprite.position.x = this.randomRange(this.bounds.left - 50, this.bounds.right + 50);
    particle.sprite.position.y = this.bounds.top + 50;
    particle.time = 0;
    particle.rotation = Math.random() * Math.PI * 2;
  }
  
  /**
   * Generate random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random value
   */
  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }
  
  /**
   * Clean up all particles and remove from scene
   */
  dispose() {
    for (const particle of this.particles) {
      this.scene.remove(particle.sprite);
      particle.sprite.geometry.dispose();
      particle.sprite.material.dispose();
    }
    this.particles = [];
  }
}
