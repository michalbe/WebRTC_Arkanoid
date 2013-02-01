var PRTC = PRTC || {};

PRTC.background = {
  texture: 'assets/bg.jpg',
  material: null,
  width: 100,
  height: 200,
  plane: null,

  init: function background_init() {
    this.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(this.texture)
    });
    
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300), 
      this.material
    );
    this.plane.overdraw = true;
    
    this.plane.scale.x = this.plane.scale.y = 6;
    PRTC.scene.add(this.plane);
  }
}
