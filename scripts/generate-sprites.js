// Script to generate character sprite sheets
// Run with: node scripts/generate-sprites.js

const fs = require('fs');
const path = require('path');

// Simple PNG encoder for our small sprites
function createPNG(width, height, pixels) {
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw pixels
  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < pixels.length; i++) {
    imageData.data[i] = pixels[i];
  }
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toBuffer('image/png');
}

// Character colors
const characters = [
  { name: 'red', primary: [255, 51, 51], secondary: [200, 40, 40], filename: 'player_red.png' },
  { name: 'blue', primary: [51, 51, 255], secondary: [40, 40, 200], filename: 'player_blue.png' },
  { name: 'green', primary: [51, 255, 51], secondary: [40, 200, 40], filename: 'player_green.png' },
  { name: 'yellow', primary: [255, 255, 51], secondary: [200, 200, 40], filename: 'player_yellow.png' },
];

// Sprite dimensions
const SPRITE_SIZE = 16;
const FRAMES = 3;
const DIRECTIONS = 4;
const SHEET_WIDTH = SPRITE_SIZE * FRAMES;
const SHEET_HEIGHT = SPRITE_SIZE * DIRECTIONS;

function drawCharacterSprite(primary, secondary, frame, direction) {
  // Create 16x16 pixel array (RGBA)
  const pixels = new Array(SPRITE_SIZE * SPRITE_SIZE * 4).fill(0);
  
  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= SPRITE_SIZE || y < 0 || y >= SPRITE_SIZE) return;
    const idx = (y * SPRITE_SIZE + x) * 4;
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = a;
  };
  
  const drawRect = (x, y, w, h, color) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        setPixel(x + dx, y + dy, color[0], color[1], color[2], color[3] || 255);
      }
    }
  };
  
  const black = [0, 0, 0];
  const skin = [255, 220, 177];
  const white = [255, 255, 255];
  const hair = [101, 67, 33];
  
  // Direction: 0=down, 1=up, 2=right, 3=left
  // Frame: 0=idle, 1=walk1(left foot), 2=walk2(right foot)
  
  // Head (all directions)
  drawRect(5, 2, 6, 6, skin); // Head
  
  // Hair
  drawRect(5, 2, 6, 2, hair); // Hair top
  drawRect(4, 2, 1, 3, hair); // Hair left
  drawRect(11, 2, 1, 3, hair); // Hair right
  
  // Outline head
  for (let x = 5; x < 11; x++) {
    setPixel(x, 1, ...black); // Top
    setPixel(x, 8, ...black); // Bottom
  }
  for (let y = 2; y < 8; y++) {
    setPixel(4, y, ...black); // Left
    setPixel(11, y, ...black); // Right
  }
  
  // Body (outfit color)
  drawRect(6, 8, 4, 4, primary); // Body
  
  // Body outline
  for (let x = 6; x < 10; x++) {
    setPixel(x, 7, ...black); // Top
    setPixel(x, 12, ...black); // Bottom
  }
  for (let y = 8; y < 12; y++) {
    setPixel(5, y, ...black); // Left
    setPixel(10, y, ...black); // Right
  }
  
  // Legs based on frame and direction
  let leftLegY = 12;
  let rightLegY = 12;
  
  if (frame === 1) { // Left foot forward
    leftLegY = 13;
    rightLegY = 12;
  } else if (frame === 2) { // Right foot forward
    leftLegY = 12;
    rightLegY = 13;
  }
  
  // Draw legs
  drawRect(6, leftLegY, 2, 3, secondary); // Left leg
  drawRect(8, rightLegY, 2, 3, secondary); // Right leg
  
  // Leg outlines
  setPixel(5, leftLegY, ...black);
  setPixel(8, leftLegY, ...black);
  setPixel(6, leftLegY + 3, ...black);
  setPixel(7, leftLegY + 3, ...black);
  
  setPixel(7, rightLegY, ...black);
  setPixel(10, rightLegY, ...black);
  setPixel(8, rightLegY + 3, ...black);
  setPixel(9, rightLegY + 3, ...black);
  
  // Eyes based on direction
  if (direction === 0) { // Down
    setPixel(6, 5, ...black);
    setPixel(9, 5, ...black);
  } else if (direction === 1) { // Up (back of head)
    // No eyes visible
  } else if (direction === 2) { // Right
    setPixel(9, 5, ...black);
  } else if (direction === 3) { // Left
    setPixel(6, 5, ...black);
  }
  
  // Mouth (only when facing down)
  if (direction === 0) {
    setPixel(7, 7, ...black);
    setPixel(8, 7, ...black);
  }
  
  // Arms
  if (direction === 2 || direction === 3) { // Side view
    const armX = direction === 2 ? 10 : 5;
    drawRect(armX, 9, 1, 3, primary);
    setPixel(armX, 8, ...black);
    setPixel(armX, 12, ...black);
  }
  
  return pixels;
}

function generateSpriteSheet(primary, secondary, filename) {
  console.log(`Generating ${filename}...`);
  
  // Create full sprite sheet
  const sheetPixels = new Array(SHEET_WIDTH * SHEET_HEIGHT * 4).fill(0);
  
  for (let dir = 0; dir < DIRECTIONS; dir++) {
    for (let frame = 0; frame < FRAMES; frame++) {
      const spritePixels = drawCharacterSprite(primary, secondary, frame, dir);
      
      // Copy sprite to sheet
      const offsetX = frame * SPRITE_SIZE;
      const offsetY = dir * SPRITE_SIZE;
      
      for (let y = 0; y < SPRITE_SIZE; y++) {
        for (let x = 0; x < SPRITE_SIZE; x++) {
          const srcIdx = (y * SPRITE_SIZE + x) * 4;
          const dstIdx = ((offsetY + y) * SHEET_WIDTH + (offsetX + x)) * 4;
          
          sheetPixels[dstIdx] = spritePixels[srcIdx];
          sheetPixels[dstIdx + 1] = spritePixels[srcIdx + 1];
          sheetPixels[dstIdx + 2] = spritePixels[srcIdx + 2];
          sheetPixels[dstIdx + 3] = spritePixels[srcIdx + 3];
        }
      }
    }
  }
  
  const buffer = createPNG(SHEET_WIDTH, SHEET_HEIGHT, sheetPixels);
  fs.writeFileSync(path.join(__dirname, '../public/sprites', filename), buffer);
  console.log(`✓ Created ${filename}`);
}

// Check if canvas module is available
try {
  require.resolve('canvas');
  
  // Generate all character sprite sheets
  characters.forEach(char => {
    generateSpriteSheet(char.primary, char.secondary, char.filename);
  });
  
  console.log('\n✓ All sprite sheets generated successfully!');
} catch (e) {
  console.log('Canvas module not found. Installing...');
  console.log('Please run: npm install canvas --save-dev');
  console.log('Then run this script again.');
}
