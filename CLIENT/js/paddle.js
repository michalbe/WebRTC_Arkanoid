var PRTC = PRTC || {};

PRTC.paddle = {
  // flag for 'game' module
  updatable: true,
  
  texture: 'assets/fire-texture.jpg',
  material: null,
  width: 100,
  height: 200,
  dept: 30,
  cube: null,
  
  startPosition: -780,
  
  init: function paddle_init() {
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
    
    this.cube.position.x = this.startPosition;
    PRTC.scene.add(this.cube);
  },
  
  update: function paddle_update() {
    //this.rotation.z += 0.3;
  }
}

// oponents paddle

PRTC.opponentsPaddle = eval(uneval(PRTC.paddle));
PRTC.opponentsPaddle.startPosition = 780;
