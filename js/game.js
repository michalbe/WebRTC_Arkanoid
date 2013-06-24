var PRTC = PRTC || {};

PRTC.game = {  
  running: false,
  
  modules: [
    'scene',
    'net', 
    
    'level',
    'ball',
    'paddle',
    'opponentsPaddle',
    'block',
  ],
  
  keyboard: new THREEx.KeyboardState(),
  updatable: [],
  
  init: function game_init() {
    this.modules.forEach(this.initModule, this);
    this.loop.ctx = this.loop.bind(this);
    this.loop.ctx();
  },
  
  generateBlocks: function(){
    var blocks = [];
    for (var i=0; i< PRTC.block.numberOfBlocks; i++) {
      blocks.push(PRTC.block.create());
    }
    
    PRTC.ball.addCollidingObjects(blocks);
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
  
  start:  function(){
    this.running = true;
    this.loop();
  },
  
  stop: function(){
    this.running = false;
  },
  
  loop: function game_loop() {
    this.updateModules();
    PRTC.scene.render();
    if (this.running) {
      window.requestAnimationFrame(this.loop.ctx);
    }
  }
}

PRTC.game.init();