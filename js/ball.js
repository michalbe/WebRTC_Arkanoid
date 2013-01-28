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
    this.sphere.rotation.z += 0.3;
  }
}
