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
  
  update: function ball_update() {
    var pos = this.sphere.position;
    if (pos.y > PRTC.scene.MAX_Y) {
      //this.sphere.position.y -= this.velocityY;
      this.velocityY *= -1;
    } else if (pos.y < -1*PRTC.scene.MAX_Y) {
      this.velocityY *= -1;
    }
    this.sphere.position.x += this.velocityX;
    this.sphere.position.y += this.velocityY;
    this.sphere.rotation.x += -1*this.velocityY/60;
    //this.sphere.rotation.x += 0.3;
  }
}
