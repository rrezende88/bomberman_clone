import * as THREE from 'three';

// SpriteLoader manages loading and caching of pixel art textures
export class SpriteLoader {
  constructor() {
    this.textures = new Map();
    this.spriteSheets = new Map();
    this.loader = new THREE.TextureLoader();
  }

  // Load a sprite sheet image
  async loadSpriteSheet(path) {
    // Check cache first
    if (this.spriteSheets.has(path)) {
      return this.spriteSheets.get(path);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (texture) => {
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          this.spriteSheets.set(path, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load sprite sheet: ${path}`, error);
          reject(error);
        }
      );
    });
  }

  // Extract a single frame from a sprite sheet
  createAnimatedCharacterTexture(spriteSheet, frameX, frameY, spriteSize = 16) {
    if (!spriteSheet) {
      console.error('Sprite sheet is null or undefined');
      return this.createColorTexture('#ff00ff', 32); // Fallback magenta square
    }

    const canvas = document.createElement('canvas');
    canvas.width = spriteSize;
    canvas.height = spriteSize;
    const ctx = canvas.getContext('2d');

    // Calculate source position in sprite sheet
    const sx = frameX * spriteSize;
    const sy = frameY * spriteSize;

    // Draw the specific frame from the sprite sheet
    ctx.drawImage(
      spriteSheet.image,
      sx, sy, spriteSize, spriteSize,
      0, 0, spriteSize, spriteSize
    );

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    return texture;
  }

  // Create a simple colored square texture for pixel art
  createColorTexture(color, size = 16) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create character sprite (simple colored square with border)
  createCharacterTexture(color, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Body
    ctx.fillStyle = color;
    ctx.fillRect(4, 4, size - 8, size - 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 12, 4, 4);
    ctx.fillRect(size - 14, 12, 4, 4);
    
    // Border/outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, size - 8, size - 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create bomb sprite
  createBombTexture(size = 32, fuseProgress = 1.0) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Bomb body
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(size / 2 - 4, size / 2 - 4, size / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Fuse
    if (fuseProgress > 0) {
      const fuseColor = fuseProgress > 0.3 ? '#ff6600' : '#ff0000';
      ctx.strokeStyle = fuseColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 6);
      ctx.lineTo(size / 2, 0);
      ctx.stroke();
      
      // Spark
      ctx.fillStyle = fuseColor;
      ctx.beginPath();
      ctx.arc(size / 2, 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create explosion sprite
  createExplosionTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Outer glow
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(0, 0, size, size);
    
    // Inner fire
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(size / 4, size / 4, size / 2, size / 2);
    
    // Center white hot
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size / 3, size / 3, size / 3, size / 3);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create wall texture
  createWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - gray bricks
      ctx.fillStyle = '#666666';
      ctx.fillRect(0, 0, size, size);
      
      // Brick pattern
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, size / 2, size / 2);
      ctx.strokeRect(size / 2, 0, size / 2, size / 2);
      ctx.strokeRect(0, size / 2, size / 2, size / 2);
      ctx.strokeRect(size / 2, size / 2, size / 2, size / 2);
    } else {
      // Soft wall - brown crates
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 0, size, size);
      
      // Wood grain
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      for (let i = 0; i < size; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
      }
      
      // Border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create floor texture with theme parameters
  createFloorTexture(config, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Base color
    ctx.fillStyle = config.baseColor || '#90EE90';
    ctx.fillRect(0, 0, size, size);
    
    // Pattern type handling (can have multiple patterns)
    if (config.pattern === 'checkerboard' && config.patternColor) {
      ctx.fillStyle = config.patternColor;
      ctx.fillRect(size / 2, 0, size / 2, size / 2);
      ctx.fillRect(0, size / 2, size / 2, size / 2);
    }
    
    if ((config.pattern === 'patches' || config.patchPattern === 'patches') && config.patches) {
      // Draw patches
      config.patches.forEach(patch => {
        ctx.fillStyle = patch.color;
        if (patch.type === 'rect') {
          ctx.fillRect(patch.x, patch.y, patch.width, patch.height);
        } else if (patch.type === 'circle') {
          ctx.beginPath();
          ctx.arc(patch.x, patch.y, patch.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    
    if ((config.pattern === 'ripples' || config.ripplePattern === 'ripples') && config.rippleColor) {
      // Draw ripples
      ctx.strokeStyle = config.rippleColor;
      ctx.lineWidth = config.rippleWidth || 1;
      const rippleCount = config.rippleCount || 4;
      for (let i = 0; i < rippleCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * (size / rippleCount) + (size / rippleCount) / 2);
        ctx.lineTo(size, i * (size / rippleCount) + (size / rippleCount) / 2 + 1);
        ctx.stroke();
      }
    }
    
    if ((config.pattern === 'arcs' || config.arcPattern === 'arcs') && config.arcColor) {
      // Draw arcs (for water)
      ctx.strokeStyle = config.arcColor;
      ctx.lineWidth = config.arcWidth || 1;
      if (config.arcs) {
        config.arcs.forEach(arc => {
          ctx.beginPath();
          ctx.arc(arc.x, arc.y, arc.radius, arc.startAngle || 0, arc.endAngle || Math.PI * 2);
          ctx.stroke();
        });
      }
    }
    
    if (config.pattern === 'lines' && config.lineColor) {
      // Draw lines (for roads)
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = config.lineWidth || 1;
      if (config.lines) {
        config.lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.stroke();
        });
      }
      // Draw filled rectangles (for road markings)
      if (config.fillRects) {
        config.fillRects.forEach(rect => {
          ctx.fillStyle = rect.color;
          ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        });
      }
    }
    
    if ((config.pattern === 'stars' || config.starPattern === 'stars') && config.stars) {
      // Draw stars (for night)
      ctx.fillStyle = config.starColor || '#ffffff';
      config.stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size || 2, star.size || 2);
      });
    }
    
    if ((config.pattern === 'frost' || config.frostPattern === 'frost') && config.frostColor) {
      // Draw frost patterns (for ice)
      ctx.strokeStyle = config.frostColor;
      ctx.lineWidth = config.frostWidth || 1;
      if (config.frostLines) {
        config.frostLines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.stroke();
        });
      }
    }
    
    if ((config.pattern === 'bubbles' || config.bubblePattern === 'bubbles') && config.bubbles) {
      // Draw bubbles (for poison)
      config.bubbles.forEach(bubble => {
        ctx.fillStyle = bubble.color || 'rgba(139, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    if ((config.pattern === 'stripes' || config.stripePattern === 'stripes') && config.stripes) {
      // Draw stripes (for powerplant)
      config.stripes.forEach(stripe => {
        ctx.fillStyle = stripe.color;
        ctx.fillRect(stripe.x, stripe.y, stripe.width, stripe.height);
      });
    }
    
    if ((config.pattern === 'gradient' || config.gradientPattern === 'gradient') && config.gradient) {
      // Draw gradient (for night glow)
      const grad = ctx.createRadialGradient(
        config.gradient.x, config.gradient.y, config.gradient.r1,
        config.gradient.x, config.gradient.y, config.gradient.r2
      );
      config.gradient.stops.forEach(stop => {
        grad.addColorStop(stop.position, stop.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    }
    
    // Additional details (like grass blades, cracks, etc.)
    if (config.details) {
      config.details.forEach(detail => {
        if (detail.type === 'stroke') {
          ctx.strokeStyle = detail.color;
          ctx.lineWidth = detail.width || 1;
          ctx.beginPath();
          if (detail.path) {
            detail.path.forEach((point, index) => {
              if (index === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
          }
          ctx.stroke();
        } else if (detail.type === 'fill') {
          ctx.fillStyle = detail.color;
          if (detail.rect) {
            ctx.fillRect(detail.rect.x, detail.rect.y, detail.rect.width, detail.rect.height);
          }
        }
      });
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  // Create power-up textures
  createPowerupTexture(type, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Background circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    switch (type) {
      case 'bomb':
        // Bomb icon
        ctx.fillStyle = '#ff0000';
        ctx.fillText('B', size / 2, size / 2);
        break;
      case 'fire':
        // Fire icon
        ctx.fillStyle = '#ff6600';
        ctx.fillText('F', size / 2, size / 2);
        break;
      case 'speed':
        // Speed icon
        ctx.fillStyle = '#00aaff';
        ctx.fillText('S', size / 2, size / 2);
        break;
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create enemy texture
  createEnemyTexture(type, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    let color;
    switch (type) {
      case 'wanderer':
        color = '#ff00ff';
        break;
      case 'chaser':
        color = '#ff0000';
        break;
      case 'patroller':
        color = '#00ffff';
        break;
      default:
        color = '#ff00ff';
    }
    
    // Body
    ctx.fillStyle = color;
    ctx.fillRect(6, 6, size - 12, size - 12);
    
    // Evil eyes
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(10, 12, 4, 6);
    ctx.fillRect(size - 14, 12, 4, 6);
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, size - 12, size - 12);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create exit door texture
  createExitTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Door
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(4, 4, size - 8, size - 8);
    
    // Door frame
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, size - 8, size - 8);
    
    // Door handle
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - 12, size / 2, 4, 4);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === DUNGEON THEME TEXTURES ===

  // Create dungeon floor texture (warm brownstone with cracks)
  createDungeonFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Base warm brownstone
    const light = '#6b5d4f';
    const dark = '#4a3f35';
    
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, size, size);
    
    // Stone pattern - checkerboard
    ctx.fillStyle = dark;
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    
    // Add some cracks for detail
    ctx.strokeStyle = '#2a231d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.3, 0);
    ctx.lineTo(size * 0.4, size);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, size * 0.6);
    ctx.lineTo(size, size * 0.7);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  // Create dungeon wall texture (rough stone blocks)
  createDungeonWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - dark stone bricks
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(0, 0, size, size);
      
      // Stone brick pattern
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(2, 2, size / 2 - 3, size / 2 - 3);
      ctx.fillRect(size / 2 + 1, 2, size / 2 - 3, size / 2 - 3);
      ctx.fillRect(2, size / 2 + 1, size / 2 - 3, size / 2 - 3);
      ctx.fillRect(size / 2 + 1, size / 2 + 1, size / 2 - 3, size / 2 - 3);
      
      // Mortar lines
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();
      
      // Add some moss/detail
      ctx.fillStyle = '#2a4a2a';
      ctx.fillRect(4, 4, 3, 3);
      ctx.fillRect(size - 7, size - 7, 3, 3);
    } else {
      // Soft wall - wooden barrels/crates in dungeon
      ctx.fillStyle = '#4a3020';
      ctx.fillRect(0, 0, size, size);
      
      // Wood planks
      ctx.fillStyle = '#5a4030';
      for (let i = 0; i < size; i += 6) {
        ctx.fillRect(i, 0, 4, size);
      }
      
      // Metal bands
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, size * 0.25, size, 2);
      ctx.fillRect(0, size * 0.75, size, 2);
      
      // Border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, size, size);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // Create torch texture (for dungeon atmosphere)
  createTorchTexture(size = 32, frame = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Torch holder
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(size / 2 - 2, size * 0.3, 4, size * 0.6);
    
    // Flame (animated based on frame)
    const flameOffset = Math.sin(frame * 0.2) * 2;
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.25 + flameOffset, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.25 + flameOffset, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow
    const gradient = ctx.createRadialGradient(
      size / 2, size * 0.25, 0,
      size / 2, size * 0.25, size / 2
    );
    gradient.addColorStop(0, 'rgba(255, 150, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === GRASSLAND THEME TEXTURES ===

  createGrasslandFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Base grass green
    ctx.fillStyle = '#7cba4e';
    ctx.fillRect(0, 0, size, size);
    
    // Darker grass patches
    ctx.fillStyle = '#5a9e38';
    for (let i = 0; i < 4; i++) {
      const x = (i * 13) % size;
      const y = (i * 7) % size;
      ctx.fillRect(x, y, 6, 6);
    }
    
    // Grass blades (small details)
    ctx.strokeStyle = '#4d8530';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const x = (i * 11 + 3) % size;
      const y = (i * 9 + 2) % size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 3);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createGrasslandWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - rocky stone with moss
      ctx.fillStyle = '#8b8b7a';
      ctx.fillRect(0, 0, size, size);
      
      // Moss patches
      ctx.fillStyle = '#6b8e23';
      ctx.fillRect(2, 8, 10, 8);
      ctx.fillRect(18, 4, 8, 12);
      
      // Stone texture
      ctx.strokeStyle = '#6a6a5a';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 10 + 5);
        ctx.lineTo(size, i * 10 + 7);
        ctx.stroke();
      }
    } else {
      // Soft wall - bushes
      ctx.fillStyle = '#5a8f3a';
      ctx.fillRect(0, 0, size, size);
      
      // Bush foliage
      ctx.fillStyle = '#6baa4a';
      ctx.beginPath();
      ctx.arc(size / 3, size / 3, 8, 0, Math.PI * 2);
      ctx.arc(2 * size / 3, size / 3, 8, 0, Math.PI * 2);
      ctx.arc(size / 2, 2 * size / 3, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlights
      ctx.fillStyle = '#8bc55a';
      ctx.fillRect(size / 3 - 3, size / 3 - 3, 6, 6);
      ctx.fillRect(2 * size / 3 - 3, size / 3 - 3, 6, 6);
    }
    
    // Border
    ctx.strokeStyle = '#3a5a2a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === DESERT THEME TEXTURES ===

  createDesertFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Sandy base
    ctx.fillStyle = '#e6c35c';
    ctx.fillRect(0, 0, size, size);
    
    // Darker sand patches
    ctx.fillStyle = '#d4a548';
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    
    // Sand ripples
    ctx.strokeStyle = '#c89540';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 8 + 4);
      ctx.lineTo(size, i * 8 + 5);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createDesertWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - sandstone blocks
      ctx.fillStyle = '#c8a060';
      ctx.fillRect(0, 0, size, size);
      
      // Block patterns
      ctx.strokeStyle = '#a88550';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, size - 4, size / 2 - 3);
      ctx.strokeRect(2, size / 2 + 1, size - 4, size / 2 - 3);
      
      // Weathering
      ctx.fillStyle = '#b89550';
      for (let i = 0; i < 5; i++) {
        const x = (i * 7) % (size - 4) + 2;
        const y = (i * 11) % (size - 4) + 2;
        ctx.fillRect(x, y, 3, 3);
      }
    } else {
      // Soft wall - cactus
      ctx.fillStyle = '#5a8f4a';
      ctx.fillRect(size / 3, 0, size / 3, size);
      
      // Cactus arms
      ctx.fillRect(4, size / 2 - 6, size / 3 - 2, 8);
      ctx.fillRect(2 * size / 3 + 2, size / 2 + 2, size / 3 - 2, 8);
      
      // Spines
      ctx.fillStyle = '#3a5a2a';
      for (let i = 0; i < 6; i++) {
        const y = i * 5 + 2;
        ctx.fillRect(size / 2 - 1, y, 2, 2);
      }
    }
    
    // Border
    ctx.strokeStyle = '#8a7040';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === BEACH THEME TEXTURES ===

  createBeachFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Sandy beach
    ctx.fillStyle = '#f4e4c1';
    ctx.fillRect(0, 0, size, size);
    
    // Water patches
    ctx.fillStyle = '#7db9d8';
    ctx.fillRect(0, 0, size / 3, size / 3);
    ctx.fillRect(2 * size / 3, 2 * size / 3, size / 3, size / 3);
    
    // Sand details
    ctx.fillStyle = '#e8d8b5';
    for (let i = 0; i < 4; i++) {
      const x = (i * 9) % size;
      const y = (i * 13) % size;
      ctx.fillRect(x, y, 4, 4);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createBeachWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - coral rock
      ctx.fillStyle = '#d4a8a8';
      ctx.fillRect(0, 0, size, size);
      
      // Coral patterns
      ctx.fillStyle = '#ff9999';
      ctx.beginPath();
      ctx.arc(size / 3, size / 3, 6, 0, Math.PI * 2);
      ctx.arc(2 * size / 3, 2 * size / 3, 7, 0, Math.PI * 2);
      ctx.fill();
      
      // Rock texture
      ctx.strokeStyle = '#b88888';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 10, 0);
        ctx.lineTo(i * 10 + 5, size);
        ctx.stroke();
      }
    } else {
      // Soft wall - sandcastle
      ctx.fillStyle = '#e8d4aa';
      ctx.fillRect(6, 8, size - 12, size - 8);
      
      // Castle towers
      ctx.fillRect(8, 4, 6, 8);
      ctx.fillRect(size - 14, 4, 6, 8);
      
      // Details
      ctx.fillStyle = '#d4c09a';
      ctx.fillRect(size / 2 - 3, 12, 6, 8);
    }
    
    // Border
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === ROADS THEME TEXTURES ===

  createRoadsFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Asphalt base
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, size, size);
    
    // Road cracks
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(8, size);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2 + 3);
    ctx.stroke();
    
    // Yellow road line
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(0, size / 2 - 1, size / 3, 2);
    ctx.fillRect(2 * size / 3, size / 2 - 1, size / 3, 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createRoadsWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - concrete barrier
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, size, size);
      
      // Concrete texture
      ctx.fillStyle = '#999999';
      ctx.fillRect(0, 0, size, 4);
      ctx.fillRect(0, size - 4, size, 4);
      
      // Stripes
      ctx.fillStyle = '#ffcc00';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(i * 10 + 2, 8, 6, 16);
      }
      
      // Weathering
      ctx.fillStyle = '#6a6a6a';
      for (let i = 0; i < 4; i++) {
        const x = (i * 7) % (size - 4) + 2;
        const y = (i * 11) % (size - 4) + 2;
        ctx.fillRect(x, y, 3, 3);
      }
    } else {
      // Soft wall - traffic cones
      ctx.fillStyle = '#ff6600';
      
      // Cone 1
      ctx.beginPath();
      ctx.moveTo(size / 3, size - 4);
      ctx.lineTo(size / 3 - 6, size - 4);
      ctx.lineTo(size / 3 - 3, 4);
      ctx.closePath();
      ctx.fill();
      
      // Cone 2
      ctx.beginPath();
      ctx.moveTo(2 * size / 3, size - 4);
      ctx.lineTo(2 * size / 3 + 6, size - 4);
      ctx.lineTo(2 * size / 3 + 3, 4);
      ctx.closePath();
      ctx.fill();
      
      // White stripes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size / 3 - 5, size / 2, 8, 3);
      ctx.fillRect(2 * size / 3 - 1, size / 2, 8, 3);
    }
    
    // Border
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === WATER THEME TEXTURES ===

  createWaterFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Deep water base
    ctx.fillStyle = '#1e90ff';
    ctx.fillRect(0, 0, size, size);
    
    // Darker water depths
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    
    // Water ripples
    ctx.strokeStyle = '#4da6ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(size / 3, size / 3, 6, 0, Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(2 * size / 3, 2 * size / 3, 8, Math.PI, Math.PI * 2);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createWaterWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - ice block
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, size, size);
      
      // Ice crystals
      ctx.fillStyle = '#b0e0e6';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillRect(size - 12, size - 12, 8, 8);
      
      // Transparent layers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(0, i * 10 + 2, size, 6);
      }
    } else {
      // Soft wall - kelp/seaweed
      ctx.fillStyle = '#2e8b57';
      ctx.fillRect(0, 0, size, size);
      
      // Kelp strands
      ctx.strokeStyle = '#3cb371';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 10 + 6, size);
        ctx.quadraticCurveTo(i * 10 + 3, size / 2, i * 10 + 8, 0);
        ctx.stroke();
      }
      
      // Bubbles
      ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
      ctx.beginPath();
      ctx.arc(size - 8, 8, 4, 0, Math.PI * 2);
      ctx.arc(8, size - 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Border
    ctx.strokeStyle = '#0055aa';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === FOREST THEME TEXTURES ===

  createForestFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Dark forest floor
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(0, 0, size, size);
    
    // Leaf litter
    ctx.fillStyle = '#4a3020';
    for (let i = 0; i < 6; i++) {
      const x = (i * 11) % size;
      const y = (i * 7) % size;
      ctx.fillRect(x, y, 5, 5);
    }
    
    // Moss patches
    ctx.fillStyle = '#3a6025';
    ctx.fillRect(size / 3, size / 3, 8, 8);
    ctx.fillRect(2 * size / 3, 2, 6, 6);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createForestWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - old tree trunk
      ctx.fillStyle = '#4a3020';
      ctx.fillRect(0, 0, size, size);
      
      // Bark texture
      ctx.strokeStyle = '#3a2010';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 8 + 2);
        ctx.lineTo(size, i * 8 + 4);
        ctx.stroke();
      }
      
      // Knots
      ctx.fillStyle = '#2a1510';
      ctx.beginPath();
      ctx.arc(size / 3, size / 3, 4, 0, Math.PI * 2);
      ctx.arc(2 * size / 3, 2 * size / 3, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft wall - foliage/bushes
      ctx.fillStyle = '#1a4010';
      ctx.fillRect(0, 0, size, size);
      
      // Leaf clusters
      ctx.fillStyle = '#2d5520';
      for (let i = 0; i < 4; i++) {
        const x = (i % 2) * size / 2 + size / 4;
        const y = Math.floor(i / 2) * size / 2 + size / 4;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Highlights
      ctx.fillStyle = '#3a6530';
      ctx.fillRect(size / 2 - 4, size / 2 - 4, 8, 8);
    }
    
    // Border
    ctx.strokeStyle = '#1a3010';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === POISON THEME TEXTURES ===

  createPoisonFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Toxic base
    ctx.fillStyle = '#7fff00';
    ctx.fillRect(0, 0, size, size);
    
    // Poison pools
    ctx.fillStyle = '#8b008b';
    ctx.beginPath();
    ctx.arc(size / 3, size / 3, 8, 0, Math.PI * 2);
    ctx.arc(2 * size / 3, 2 * size / 3, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Toxic bubbles
    ctx.fillStyle = 'rgba(139, 255, 0, 0.5)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 13) % size;
      const y = (i * 17) % size;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createPoisonWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - toxic waste barrel
      ctx.fillStyle = '#cccc00';
      ctx.fillRect(0, 0, size, size);
      
      // Barrel bands
      ctx.fillStyle = '#999900';
      ctx.fillRect(0, 4, size, 4);
      ctx.fillRect(0, size / 2 - 2, size, 4);
      ctx.fillRect(0, size - 8, size, 4);
      
      // Hazard symbol
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#cccc00';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft wall - toxic crystals
      ctx.fillStyle = '#9932cc';
      ctx.fillRect(0, 0, size, size);
      
      // Crystal formations
      ctx.fillStyle = '#ba55d3';
      ctx.beginPath();
      ctx.moveTo(size / 3, size);
      ctx.lineTo(size / 3 - 6, size - 12);
      ctx.lineTo(size / 3 + 6, size - 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(2 * size / 3, size);
      ctx.lineTo(2 * size / 3 - 8, size - 16);
      ctx.lineTo(2 * size / 3 + 8, size - 16);
      ctx.closePath();
      ctx.fill();
      
      // Glow
      ctx.fillStyle = 'rgba(127, 255, 0, 0.3)';
      ctx.fillRect(0, 0, size, size);
    }
    
    // Border
    ctx.strokeStyle = '#6b008b';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === ICE THEME TEXTURES ===

  createIceFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Icy base
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, size, size);
    
    // Ice patches
    ctx.fillStyle = '#b0e0e6';
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    
    // Frost patterns
    ctx.strokeStyle = '#e0f0ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.lineTo(size / 2 + Math.cos(i * Math.PI / 2) * 12, 
                 size / 2 + Math.sin(i * Math.PI / 2) * 12);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createIceWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - ice block
      ctx.fillStyle = '#b0e0e6';
      ctx.fillRect(0, 0, size, size);
      
      // Ice crystals
      ctx.fillStyle = '#e0f0ff';
      for (let i = 0; i < 3; i++) {
        const x = (i * 11) % (size - 8) + 4;
        const y = (i * 13) % (size - 8) + 4;
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x - 4, y + 2);
        ctx.lineTo(x + 4, y + 2);
        ctx.closePath();
        ctx.fill();
      }
      
      // Shimmer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(2, 2, size - 4, 8);
    } else {
      // Soft wall - snow pile
      ctx.fillStyle = '#fffafa';
      ctx.fillRect(0, 0, size, size);
      
      // Snow mounds
      ctx.fillStyle = '#f0f8ff';
      ctx.beginPath();
      ctx.arc(size / 3, 2 * size / 3, 10, Math.PI, 0);
      ctx.arc(2 * size / 3, 2 * size / 3, 12, Math.PI, 0);
      ctx.fill();
      
      // Sparkles
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 5; i++) {
        const x = (i * 7) % size;
        const y = (i * 11) % size;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    
    // Border
    ctx.strokeStyle = '#87ceeb';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === POWER PLANT THEME TEXTURES ===

  createPowerplantFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Industrial floor
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, size, size);
    
    // Yellow hazard stripes
    ctx.fillStyle = '#ffcc00';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(i * 10, 0, 4, size);
    }
    
    // Metallic details
    ctx.fillStyle = '#333333';
    ctx.fillRect(2, 2, 6, 6);
    ctx.fillRect(size - 8, size - 8, 6, 6);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createPowerplantWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - electrical panel
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(0, 0, size, size);
      
      // Panel details
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillRect(size - 12, 4, 8, 8);
      ctx.fillRect(4, size - 12, 8, 8);
      ctx.fillRect(size - 12, size - 12, 8, 8);
      
      // Lightning bolt warning
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(size / 2, 6);
      ctx.lineTo(size / 2 - 4, size / 2);
      ctx.lineTo(size / 2 + 2, size / 2);
      ctx.lineTo(size / 2 - 2, size - 6);
      ctx.lineTo(size / 2 + 4, size / 2 + 4);
      ctx.lineTo(size / 2, size / 2 + 4);
      ctx.closePath();
      ctx.fill();
    } else {
      // Soft wall - generator unit
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, size, size);
      
      // Generator body
      ctx.fillStyle = '#555555';
      ctx.fillRect(6, 6, size - 12, size - 12);
      
      // Vents
      ctx.fillStyle = '#1a1a1a';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(8, 8 + i * 4, size - 16, 2);
      }
      
      // Power indicator
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(size / 2 - 2, size / 2 - 2, 4, 4);
    }
    
    // Border
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }

  // === NIGHT THEME TEXTURES ===

  createNightFloorTexture(size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Dark night base
    ctx.fillStyle = '#0f1729';
    ctx.fillRect(0, 0, size, size);
    
    // Slightly lighter patches
    ctx.fillStyle = '#2d3561';
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    
    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 6; i++) {
      const x = (i * 11) % size;
      const y = (i * 13) % size;
      ctx.fillRect(x, y, 2, 2);
    }
    
    // Dim glow
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(147, 112, 219, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }

  createNightWallTexture(isHard = true, size = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (isHard) {
      // Hard wall - dark stone with moonlight
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, size, size);
      
      // Stone blocks
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, size - 4, size / 2 - 3);
      ctx.strokeRect(2, size / 2 + 1, size - 4, size / 2 - 3);
      
      // Moonlight reflection
      ctx.fillStyle = 'rgba(147, 112, 219, 0.3)';
      ctx.fillRect(0, 0, size / 2, size);
    } else {
      // Soft wall - shadowy bushes
      ctx.fillStyle = '#0a0a1e';
      ctx.fillRect(0, 0, size, size);
      
      // Bush silhouettes
      ctx.fillStyle = '#1a1a3e';
      ctx.beginPath();
      ctx.arc(size / 3, 2 * size / 3, 10, 0, Math.PI * 2);
      ctx.arc(2 * size / 3, 2 * size / 3, 12, 0, Math.PI * 2);
      ctx.arc(size / 2, size / 3, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Faint purple glow
      ctx.fillStyle = 'rgba(138, 43, 226, 0.2)';
      ctx.fillRect(0, 0, size, size);
    }
    
    // Border
    ctx.strokeStyle = '#4a4a6e';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    
    return texture;
  }
}
