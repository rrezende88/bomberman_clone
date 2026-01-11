import TILE_BEHAVIORS from '../parameters/TileBehaviors.js';

/**
 * StageLoader - Loads and parses stage layout data from text strings
 * Handles stage data including walls, enemy spawns, and player position
 */
export class StageLoader {
  constructor() {
    this.stageCache = {};
  }

  /**
   * Load a stage from text data
   * @param {string} stageText - Stage layout as text string
   * @param {string} cacheKey - Optional cache key
   * @returns {Object} Parsed stage data
   */
  loadStage(stageText, cacheKey = null) {
    // Check cache first if key provided
    if (cacheKey && this.stageCache[cacheKey]) {
      return this.stageCache[cacheKey];
    }

    try {
      const stageData = this.parseStage(stageText);
      
      // Cache the parsed data if key provided
      if (cacheKey) {
        this.stageCache[cacheKey] = stageData;
      }
      
      return stageData;
    } catch (error) {
      console.error('Error parsing stage:', error);
      return this.createDefaultStage();
    }
  }

  /**
   * Parse stage text into structured data
   * @param {string} text - Raw stage file content
   * @returns {Object} Parsed stage data
   */
  parseStage(text) {
    // Normalize line endings (handle Windows \r\n)
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    const lines = normalizedText.split('\n')
      .filter(line => {
        const trimmed = line.trim();
        // Remove empty lines and comments
        return trimmed.length > 0 && !trimmed.startsWith('//');
      });

    const stageData = {
      width: 0,
      height: 0,
      playerSpawn: null,
      hardWalls: [],
      softWalls: [],
      enemies: [],
      specialTiles: [],
      grid: []
    };

    let y = 0;
    for (const line of lines) {
      const row = [];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        row.push(char);

        // Get behavior if it exists, otherwise use the character itself
        const behavior = TILE_BEHAVIORS[char];
        const key = behavior?.type || char;

        switch (key) {
          case 'hardWall':
            stageData.hardWalls.push({ x, y });
            break;
          
          case 'softWall':
            stageData.softWalls.push({ x, y });
            break;
          
          case 'empty':
            // Empty space - do nothing
            break;
          
          case 'sandFloor':
            // Special tile with behavior properties
            stageData.specialTiles.push({ 
              x, 
              y, 
              type: 'sandFloor', 
              properties: behavior 
            });
            break;
          
          case 'turboFloor':
            // Turbo tile with speed boost properties
            stageData.specialTiles.push({ 
              x, 
              y, 
              type: 'turboFloor', 
              properties: behavior 
            });
            break;
          
          case 'P':
            // Player spawn
            stageData.playerSpawn = { x, y };
            break;
          
          case 'E':
          case '1':
          case '2':
          case '3':
            // Enemy spawn
            // E or 1 = chaser, 2 = wanderer, 3 = patroller
            let type = 'chaser';
            if (char === '2') type = 'wanderer';
            else if (char === '3') type = 'patroller';
            stageData.enemies.push({ x, y, type });
            break;
          
          default:
            // Unknown characters are treated as empty space
            break;
        }
      }
      
      stageData.grid.push(row);
      stageData.width = Math.max(stageData.width, row.length);
      y++;
    }
    
    stageData.height = y;

    console.log(`Stage loaded: ${stageData.width}x${stageData.height}, ${stageData.softWalls.length} soft walls, ${stageData.hardWalls.length} hard walls`);

    // Set default player spawn if not specified
    if (!stageData.playerSpawn) {
      stageData.playerSpawn = { x: 1, y: 1 };
    }

    return stageData;
  }

  /**
   * Create a default fallback stage
   * @returns {Object} Default stage data
   */
  createDefaultStage() {
    const width = 21;
    const height = 12;
    const stageData = {
      width,
      height,
      playerSpawn: { x: 1, y: 1 },
      hardWalls: [],
      softWalls: [],
      enemies: [],
      grid: []
    };

    // Create basic bordered stage
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          // Border walls
          stageData.hardWalls.push({ x, y });
          row.push('#');
        } else if (x % 2 === 0 && y % 2 === 0) {
          // Grid pattern
          stageData.hardWalls.push({ x, y });
          row.push('#');
        } else {
          row.push('.');
        }
      }
      stageData.grid.push(row);
    }

    return stageData;
  }

  /**
   * Validate stage dimensions
   * @param {Object} stageData - Stage data to validate
   * @param {number} expectedWidth - Expected grid width
   * @param {number} expectedHeight - Expected grid height
   * @returns {boolean} Whether stage is valid
   */
  validateStage(stageData, expectedWidth, expectedHeight) {
    if (stageData.width !== expectedWidth || stageData.height !== expectedHeight) {
      console.warn(`Stage dimensions mismatch: expected ${expectedWidth}x${expectedHeight}, got ${stageData.width}x${stageData.height}`);
      return false;
    }

    if (!stageData.playerSpawn) {
      console.warn('Stage missing player spawn point');
      return false;
    }

    return true;
  }

  /**
   * Clear the stage cache
   */
  clearCache() {
    this.stageCache = {};
  }
}
