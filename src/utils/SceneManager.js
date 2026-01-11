// SceneManager handles transitions between game states
export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.transitionCallback = null;
  }

  // Register a scene
  addScene(name, scene) {
    this.scenes.set(name, scene);
  }

  // Switch to a different scene
  switchTo(name, data = {}) {
    if (this.currentScene) {
      this.currentScene.onExit();
    }

    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene "${name}" not found`);
      return;
    }

    this.currentScene = scene;
    this.currentScene.onEnter(data);

    if (this.transitionCallback) {
      this.transitionCallback(name, scene);
    }
  }

  // Update current scene
  update(deltaTime) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }
  }

  // Render current scene
  render(renderer, camera) {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(renderer, camera);
    }
  }

  // Get current scene
  getCurrent() {
    return this.currentScene;
  }

  // Set callback for scene transitions
  onTransition(callback) {
    this.transitionCallback = callback;
  }
}
