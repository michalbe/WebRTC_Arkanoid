var PRTC = PRTC || {};

PRTC.scene = {
  WIDTH: window.innerWidth, //1200,
  HEIGHT: window.innerHeight, //700,
  VIEW_ANGLE: 45,
  ASPECT: null,
  NEAR: 0.1,
  FAR: 10000,
  
  MAX_Y: 480,
  MAX_X: 500,
  
  container: null,

  renderer: null,
  camera: null,
  scene: null,

  init: function main_init() {
    this.ASPECT     = this.WIDTH / this.HEIGHT;

    // get the DOM element to attach to
    this.container = document.body,

    // create a WebGL renderer, camera
    // and a scene
    this.renderer = new THREE.WebGLRenderer();
    this.camera   = new THREE.PerspectiveCamera(
      this.VIEW_ANGLE,
      this.ASPECT,
      this.NEAR,
      this.FAR
    );
    this.scene    = new THREE.Scene();
    
    // the camera starts at 0,0,0 so pull it back
    this.camera.position.set(0,150, 1200);
    this.camera.rotation.x = 0.2;
    
    // start the renderer
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    // attach the render-supplied DOM element
    this.container.appendChild(
      this.renderer.domElement
    );

    // and the camera
    this.add(this.camera);
    
    THREEx.WindowResize(this.renderer, this.camera);
    
    this.setLights(0, 255, 255);
  },
  
  setLights: function main_setLights(x, y, z) {
    // create a point light
    this.pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    this.pointLight.position.x = x;
    this.pointLight.position.y = y;
    this.pointLight.position.z = z;
    
    // add to the scene
    this.add(this.pointLight);

  },
  
  add: function scene_add(object) {
    this.scene.add(object);
  },
  
  remove: function scene_add(object) {
    this.scene.remove(object);
  },
  
  render: function main_render() { 
    this.renderer.render(this.scene, this.camera);
  },
  
  update: function(){
    var timer = Date.now() * 0.005;

    this.camera.position.x = Math.cos( timer ) * 100;
    this.camera.position.z = Math.sin( timer ) * 100
  
    this.camera.lookAt( PRTC.ball.sphere.position );
  }
}