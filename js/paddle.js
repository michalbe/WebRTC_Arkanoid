var PRTC = PRTC || {};

PRTC.paddle = {
  // flag for 'game' module
  updatable: true,
  
  texture: 'assets/paddle.jpg',
  material: null,
  width: 200,
  height: 20,
  dept: 100,
  cube: null,
  step: 10,
  keyboard: null,
  maxDistance: null,
  
  init: function paddle_init() {
    this.maxDistance = PRTC.level.distance - (this.width/2) - (PRTC.level.blockWidth/2);
    this.keyboard = PRTC.game.keyboard;
    this.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(this.texture)
    });
    
    this.cube = new THREE.Mesh(
      new THREE.CubeGeometry(
        this.width,
        this.height,
        this.dept
      ),
      this.material
    );
    
    this.cube.name = "paddle";
    this.cube.position.y = this.height*1.1;
    this.cube.vel = 0;
    
    PRTC.scene.add(this.cube);
    PRTC.ball.addCollidingObjects(this.cube);
  },
  
  update: function paddle_update() {
    if (this.keyboard.pressed("left") && this.cube.position.x > -1*this.maxDistance) {
      PRTC.net.send(this.cube.position.x);
      this.cube.position.x -= this.step;
      this.cube.vel = -2;
    } else if ( this.keyboard.pressed("right") && this.cube.position.x < this.maxDistance) {
      PRTC.net.send(this.cube.position.x);
      this.cube.position.x += this.step;
      this.cube.vel = 2;
    } else {
      this.cube.vel = 0;
    }
  }
}


PRTC.opponentsPaddle = function clone(obj){
  
  if(obj == null || typeof(obj) != 'object')
    return obj;
    
  var temp = obj.constructor();

  for(var key in obj)
    temp[key] = clone(obj[key]);
  
  return temp;
  
}(PRTC.paddle);

PRTC.opponentsPaddle.hidden = true;
PRTC.opponentsPaddle.update = function(){};