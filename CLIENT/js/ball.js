var PRTC = PRTC || {};

PRTC.ball = {
  // flag for 'game' module
  updatable: true,
  
  texture: 'assets/ball-texture.jpg',
  material: null,
  radius: 50,
  segments: 16,
  rings: 16,
  sphere: null,
  velocityX: 0,
  velocityY: 30,
  
  init: function ball_init() {
    this.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(this.texture)
    });
    
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        this.radius,
        this.segments,
        this.rings
      ),
      this.material
    );

    this.sphere.name = "ball";
    PRTC.scene.add(this.sphere);
  },
  
  collidesWith: function (object) {
    // I know it's not the best solution, but it's 7AM and I worked 
    // on it for almost 27h now. Feel free to send a pull request :)
    var y = this.sphere.position.y;
    var x = this.sphere.position.x;
    var r = this.radius;
    
    var oX = object.cube.position.x;
    var oY = object.cube.position.y;
    var h = object.height;
    var w = object.width;
    
    // if ( y + r > oY - h ) { return false; }
    // if ( y - r < oY + h ) { return false; }
    // if ( x - r > oX + w ) { return false; }
    // if ( x + r < oX - w ) { return false; }
    //                       
    // return true;  
    
    if (x >= PRTC.scene.width/2 - w || 
    			x <= -PRTC.scene.width/2 + w) {
    			  return true;
    			} else {
    			  return false;
    			}
  },
      
  update: function ball_update() {
  }
}
