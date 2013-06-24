var PRTC = PRTC || {};

PRTC.block = {  
  updatable: true,
  
  patternURL: 'assets/blocks.png',
  materials: {},
  geometry: null,
  size: 50,
  nextX: null,
  nextY: null,
  marginX: 10,
  marginY: 10,
  blocksInRow: 21,
  numberOfBlocks: 168,
  blocksCreated: 0,
  blocksDestroyed: 0,
  blocksColors: null,
  toRemove: [],
  
  init: function paddle_init() {
    this.geometry = new THREE.CubeGeometry(
      this.size,
      this.size,
      this.size
    );
    
    this.marginY = this.marginX = ((PRTC.level.distance*2)-(PRTC.level.blockWidth) - (this.blocksInRow*this.size))/(this.blocksInRow+2);
    this.nextY = PRTC.level.blockHeight - (this.size/2) - this.marginY;
    this.nextX = (PRTC.level.distance * -1) + (PRTC.level.blockWidth/2) + (this.size/2) + this.marginX;
    
    var img = new Image();
    img.onload = function(){
       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext('2d');
       canvas.width = this.blocksInRow;
       canvas.height = this.numberOfBlocks/this.blocksInRow;
       ctx.drawImage(img, 0, 0);
       this.blocksColors = ctx.getImageData(0, 0, canvas.width, canvas.height).data;       
       PRTC.game.generateBlocks();
    }.bind(this);
    
    img.src = this.patternURL;
  },
  
  create: function() {
    var block = new THREE.Mesh(
      this.geometry,
      this.getMaterial()
    );
    
    block.position.set(this.nextX, this.nextY, 0);
    
    this.nextX += (this.size + this.marginX);
    
    this.blocksCreated++;
    if (this.blocksCreated%this.blocksInRow === 0) {
       this.nextY -= this.size + this.marginY;
       this.nextX = (PRTC.level.distance * -1) + (PRTC.level.blockWidth/2) + (this.size/2) + this.marginX;
     }
    
    block.name = "block";
    PRTC.scene.add(block);
    
    return block;
  },
  
  getMaterial: function() {
    var index = this.blocksCreated*4;
    var hash = this.r2h(
      this.blocksColors[index],
      this.blocksColors[index+1],
      this.blocksColors[index+2]
    );
    
    if (this.materials[hash]) return this.materials[hash];
    
    return this.materials[hash] = new THREE.MeshLambertMaterial({ color: hash });
  },
  
  r2h: function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  
  removeBlock: function(block) {
    this.toRemove.push(block);
  },
  
  update: function(){
    if (this.toRemove.length < 1) return;
    
    this.toRemove.forEach(function(block, index){
      if (block.scale.y < 0.1) {
      //if (block.position.y < 0) {
        PRTC.scene.remove(block);
        this.toRemove[index] = '';
      } else {
        //block.position.y -= 10;
        block.scale.y -= 0.05;
        block.scale.x -= 0.05;
      }
    }, this);
    
    this.toRemove = this.toRemove.filter(function(obj) { return obj !== ''; });
  }
}