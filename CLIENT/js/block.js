var PRTC = PRTC || {};

PRTC.block = {  
  texture: 'assets/paddle.jpg',
  material: null,
  size: 50,
  nextX: null,
  nextY: null,
  marginX: 10,
  marginY: 10,
  blocksInRow: 11,
  blocksCreated: 0,
  
  init: function paddle_init() {
    this.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(this.texture)
    });
    
    this.marginX = ((PRTC.level.distance*2)-(PRTC.level.blockWidth) - (this.blocksInRow*this.size))/(this.blocksInRow+2);
    this.nextY = PRTC.level.blockHeight - (this.size/2) - this.marginY;
    this.nextX = (PRTC.level.distance * -1) + (PRTC.level.blockWidth/2) + (this.size/2) + this.marginX;
  },
  
  create: function() {
    
    this.blocksCreated++;
    
    var block = new THREE.Mesh(
      new THREE.CubeGeometry(
        this.size,
        this.size,
        this.size
      ),
      this.material
    );
    
    block.position.set(this.nextX, this.nextY, 0);
    
    this.nextX +=  (this.size + this.marginX);
    
    if (this.blocksCreated%this.blocksInRow === 0) {
       this.nextY -= this.size + this.marginY;
       this.nextX = (PRTC.level.distance * -1) + (PRTC.level.blockWidth/2) + (this.size/2) + this.marginX;
     }
    
    block.name = "block";
    PRTC.scene.add(block);
    return block;
    
  }
}