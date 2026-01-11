import * as THREE from 'three';
import { SceneManager } from './utils/SceneManager.js';
import { SpriteLoader } from './utils/SpriteLoader.js';
import { FontLoader } from './utils/FontLoader.js';
import { InputManager } from './systems/InputManager.js';
import { GameConfig } from './utils/GameConfig.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { StageSelectScene } from './scenes/StageSelectScene.js';
import { GameScene } from './scenes/GameScene.js';

class Game {
  constructor() {
    this.clock = new THREE.Clock();
    this.init();
  }

  async init() {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1); // Keep pixels sharp
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = 'game-canvas';

    // Create orthographic camera for 2D view
    // Show 12 rows: 1 for HUD + 11 for game grid
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = (GameConfig.GRID_HEIGHT + 1) * GameConfig.TILE_SIZE; // +1 for HUD row
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    // Initialize systems
    this.spriteLoader = new SpriteLoader();
    this.fontLoader = new FontLoader();
    this.inputManager = new InputManager();
    this.sceneManager = new SceneManager();

    // Wait for font to load
    console.log('Loading Capcom-style arcade font...');
    await this.fontLoader.init();
    console.log('Font ready!');

    // Create and register scenes
    this.mainMenuScene = new MainMenuScene(this);
    this.characterSelectScene = new CharacterSelectScene(this);
    this.stageSelectScene = new StageSelectScene(this);
    this.gameScene = new GameScene(this);

    this.sceneManager.addScene('mainMenu', this.mainMenuScene);
    this.sceneManager.addScene('characterSelect', this.characterSelectScene);
    this.sceneManager.addScene('stageSelect', this.stageSelectScene);
    this.sceneManager.addScene('game', this.gameScene);

    // Start at main menu
    this.sceneManager.switchTo('mainMenu');

    // Handle window resize
    window.addEventListener('resize', () => this.onResize());

    // Hide loading screen
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');

    // Start game loop
    this.animate();
  }

  onResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = (GameConfig.GRID_HEIGHT + 1) * GameConfig.TILE_SIZE; // +1 for HUD row
    
    this.camera.left = frustumSize * aspect / -2;
    this.camera.right = frustumSize * aspect / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = frustumSize / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update input
    this.inputManager.update();

    // Update current scene
    this.sceneManager.update(deltaTime);

    // Render current scene
    const currentScene = this.sceneManager.getCurrent();
    if (currentScene && currentScene.scene) {
      this.renderer.render(currentScene.scene, this.camera);
    }
  }
}

// Start the game
new Game();
