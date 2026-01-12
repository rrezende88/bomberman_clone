/**
 * Theme behavior configurations
 * Defines floor textures, background colors, and weather effects for each theme
 */

export const THEMES = {
  'classic': {
    floorTexture: {
      baseColor: '#90EE90',
      pattern: 'checkerboard',
      patternColor: '#7BC87B'
    },
    backgroundColor: 0x2a4a2a, // Classic green
    weatherEffect: null
  },
  'grassland': {
    floorTexture: {
      baseColor: '#7cba4e',
      pattern: 'patches',
      patches: [
        { type: 'rect', color: '#5a9e38', x: 0, y: 0, width: 6, height: 6 },
        { type: 'rect', color: '#5a9e38', x: 13, y: 7, width: 6, height: 6 },
        { type: 'rect', color: '#5a9e38', x: 26, y: 14, width: 6, height: 6 },
        { type: 'rect', color: '#5a9e38', x: 39, y: 21, width: 6, height: 6 }
      ],
      details: [
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 3, y: 2 }, { x: 3, y: -1 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 14, y: 11 }, { x: 14, y: 8 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 25, y: 20 }, { x: 25, y: 17 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 36, y: 29 }, { x: 36, y: 26 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 47, y: 38 }, { x: 47, y: 35 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 58, y: 47 }, { x: 58, y: 44 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 69, y: 56 }, { x: 69, y: 53 }] },
        { type: 'stroke', color: '#4d8530', width: 1, path: [{ x: 80, y: 65 }, { x: 80, y: 62 }] }
      ]
    },
    backgroundColor: 0x6ab04c, // Green
    weatherEffect: 'flower'
  },
  'desert': {
    floorTexture: {
      baseColor: '#e6c35c',
      pattern: 'checkerboard',
      patternColor: '#d4a548',
      ripplePattern: 'ripples',
      rippleColor: '#c89540',
      rippleWidth: 1,
      rippleCount: 4
    },
    backgroundColor: 0xf0c674, // Sandy yellow
    weatherEffect: null
  },
  'beach': {
    floorTexture: {
      baseColor: '#f4e4c1',
      pattern: 'patches',
      patches: [
        { type: 'rect', color: '#7db9d8', x: 0, y: 0, width: 10, height: 10 },
        { type: 'rect', color: '#7db9d8', x: 21, y: 21, width: 10, height: 10 },
        { type: 'rect', color: '#e8d8b5', x: 9, y: 0, width: 4, height: 4 },
        { type: 'rect', color: '#e8d8b5', x: 18, y: 13, width: 4, height: 4 },
        { type: 'rect', color: '#e8d8b5', x: 27, y: 26, width: 4, height: 4 },
        { type: 'rect', color: '#e8d8b5', x: 36, y: 39, width: 4, height: 4 }
      ]
    },
    backgroundColor: 0x87ceeb, // Sky blue
    weatherEffect: null
  },
  'roads': {
    floorTexture: {
      baseColor: '#3a3a3a',
      pattern: 'lines',
      lineColor: '#2a2a2a',
      lineWidth: 1,
      lines: [
        { x1: 5, y1: 0, x2: 8, y2: 32 },
        { x1: 0, y1: 16, x2: 32, y2: 19 }
      ],
      fillRects: [
        { color: '#ffff00', x: 0, y: 15, width: 10, height: 2 },
        { color: '#ffff00', x: 21, y: 15, width: 11, height: 2 }
      ]
    },
    backgroundColor: 0x2a2a2a, // Dark gray
    weatherEffect: null
  },
  'water': {
    floorTexture: {
      baseColor: '#1e90ff',
      pattern: 'checkerboard',
      patternColor: '#0066cc',
      arcPattern: 'arcs',
      arcColor: '#4da6ff',
      arcWidth: 1,
      arcs: [
        { x: 10, y: 10, radius: 6, startAngle: 0, endAngle: Math.PI },
        { x: 21, y: 21, radius: 8, startAngle: Math.PI, endAngle: Math.PI * 2 }
      ]
    },
    backgroundColor: 0x0077be, // Deep blue
    weatherEffect: 'rain'
  },
  'forest': {
    floorTexture: {
      baseColor: '#2d5016',
      pattern: 'patches',
      patches: [
        { type: 'rect', color: '#4a3020', x: 0, y: 0, width: 5, height: 5 },
        { type: 'rect', color: '#4a3020', x: 11, y: 7, width: 5, height: 5 },
        { type: 'rect', color: '#4a3020', x: 22, y: 14, width: 5, height: 5 },
        { type: 'rect', color: '#4a3020', x: 33, y: 21, width: 5, height: 5 },
        { type: 'rect', color: '#4a3020', x: 44, y: 28, width: 5, height: 5 },
        { type: 'rect', color: '#4a3020', x: 55, y: 35, width: 5, height: 5 },
        { type: 'rect', color: '#3a6025', x: 10, y: 10, width: 8, height: 8 },
        { type: 'rect', color: '#3a6025', x: 21, y: 2, width: 6, height: 6 }
      ]
    },
    backgroundColor: 0x1a3a1a, // Dark green
    weatherEffect: null
  },
  'poison': {
    floorTexture: {
      baseColor: '#7fff00',
      pattern: 'bubbles',
      bubblePattern: 'bubbles',
      bubbles: [
        { x: 10, y: 10, radius: 8, color: '#8b008b' },
        { x: 21, y: 21, radius: 6, color: '#8b008b' },
        { x: 13, y: 0, radius: 3, color: 'rgba(139, 255, 0, 0.5)' },
        { x: 0, y: 17, radius: 3, color: 'rgba(139, 255, 0, 0.5)' },
        { x: 30, y: 13, radius: 3, color: 'rgba(139, 255, 0, 0.5)' }
      ]
    },
    backgroundColor: 0x6b8e23, // Toxic green
    weatherEffect: null
  },
  'ice': {
    floorTexture: {
      baseColor: '#f0f8ff',
      pattern: 'checkerboard',
      patternColor: '#b0e0e6',
      frostPattern: 'frost',
      frostColor: '#e0f0ff',
      frostWidth: 1,
      frostLines: [
        { x1: 16, y1: 16, x2: 28, y2: 16 },
        { x1: 16, y1: 16, x2: 16, y2: 4 },
        { x1: 16, y1: 16, x2: 4, y2: 16 },
        { x1: 16, y1: 16, x2: 16, y2: 28 }
      ]
    },
    backgroundColor: 0xd0e8f0, // Icy blue
    weatherEffect: 'snow'
  },
  'powerplant': {
    floorTexture: {
      baseColor: '#1a1a1a',
      pattern: 'stripes',
      stripes: [
        { color: '#ffcc00', x: 0, y: 0, width: 4, height: 32 },
        { color: '#ffcc00', x: 10, y: 0, width: 4, height: 32 },
        { color: '#ffcc00', x: 20, y: 0, width: 4, height: 32 }
      ],
      patchPattern: 'patches',
      patches: [
        { type: 'rect', color: '#333333', x: 2, y: 2, width: 6, height: 6 },
        { type: 'rect', color: '#333333', x: 24, y: 24, width: 6, height: 6 }
      ]
    },
    backgroundColor: 0x1a1a1a, // Industrial black
    weatherEffect: null
  },
  'night': {
    floorTexture: {
      baseColor: '#0f1729',
      pattern: 'checkerboard',
      patternColor: '#2d3561',
      starPattern: 'stars',
      starColor: '#ffffff',
      stars: [
        { x: 0, y: 0, size: 2 },
        { x: 11, y: 13, size: 2 },
        { x: 22, y: 26, size: 2 },
        { x: 33, y: 39, size: 2 },
        { x: 44, y: 52, size: 2 },
        { x: 55, y: 65, size: 2 }
      ],
      gradientPattern: 'gradient',
      gradient: {
        x: 16,
        y: 16,
        r1: 0,
        r2: 16,
        stops: [
          { position: 0, color: 'rgba(147, 112, 219, 0.1)' },
          { position: 1, color: 'rgba(147, 112, 219, 0)' }
        ]
      }
    },
    backgroundColor: 0x0a0a1e, // Dark night
    weatherEffect: null
  },
  'dungeon': {
    floorTexture: {
      baseColor: '#6b5d4f',
      pattern: 'checkerboard',
      patternColor: '#4a3f35',
      details: [
        {
          type: 'stroke',
          color: '#2a231d',
          width: 1,
          path: [
            { x: 9, y: 0 },
            { x: 12, y: 32 }
          ]
        },
        {
          type: 'stroke',
          color: '#2a231d',
          width: 1,
          path: [
            { x: 0, y: 19 },
            { x: 32, y: 22 }
          ]
        }
      ]
    },
    backgroundColor: 0x3a2f25, // Warm brown
    weatherEffect: null
  }
};
