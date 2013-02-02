var PRTC = PRTC || {};

PRTC.game = {  
  modules: [
    'scene',
    
    'level',
    'ball'
  ],
  
  updatable: [],
  
  init: function game_init() {
    this.modules.forEach(this.initModule, this);
    this.loop.ctx = this.loop.bind(this);
    this.loop.ctx();
  },
  
  initModule: function game_initModule(module) {
    module = PRTC[module] || null;
    if (!module)
      return;
      
    if (module.init && typeof module.init === 'function') {
      module.init();
      module.init = false;
    }
    
    if (module.updatable) {
      this.updatable.push(module);
    }
  },
  
  updateModules: function game_updateModules() {
    this.updatable.forEach(function(module) {
      module.update();
    });
  },
  
  loop: function game_loop() {
    this.updateModules();
    PRTC.scene.render();
    window.requestAnimationFrame(this.loop.ctx);
  }
}

PRTC.game.init();