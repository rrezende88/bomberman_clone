/**
 * CharacterBehaviors - Defines playable character properties
 * Each character has unique stats and abilities
 */

export const CHARACTERS = [
  { 
    id: 0, 
    name: 'Red Bomber', 
    color: 0xff3333, 
    speed: 2.5, 
    bombs: 1, 
    hp: 3 
  },
  { 
    id: 1, 
    name: 'Blue Bomber', 
    color: 0x3333ff, 
    speed: 3.0, 
    bombs: 1, 
    hp: 2 
  },
  { 
    id: 2, 
    name: 'Green Bomber', 
    color: 0x33ff33, 
    speed: 2.0, 
    bombs: 2, 
    immuneToSlowdown: true, 
    hp: 3 
  },
  { 
    id: 3, 
    name: 'Yellow Bomber', 
    color: 0xffff33, 
    speed: 2.0, 
    bombs: 1, 
    hp: 4 
  },
];
