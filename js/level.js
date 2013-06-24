var PRTC = PRTC || {};

PRTC.level= {
  floorTexture: 'assets/floor.jpg',
  skyTexture: 'assets/sky.jpg',
  
  blockHeight: 700,
  blockWidth: 100,
  blockDept: 100,
  
  distance: 600,
  blocks: [],
  
  init: function() {
    
    this.addFloor();
    this.addSky();
    
    this.blocks = [
      this.createBlock({
        x: this.distance,
        y: this.blockHeight/2,
        z: 0
      }, {
        width: this.blockWidth,
        height: this.blockHeight,
        dept: this.blockDept
      }, 'side'),
      this.createBlock({
        x: -1 * this.distance,
        y: this.blockHeight/2,
        z: 0
      }, {
        width: this.blockWidth,
        height: this.blockHeight,
        dept: this.blockDept
      }, 'side'),
      this.createBlock({
        x: 0,
        y: this.blockHeight + this.blockWidth/2,
        z: 0
      }, {
        width: this.distance*2 + this.blockWidth,
        height: this.blockWidth,
        dept: this.blockDept
      }, 'top')
    ];
    this.blocks.forEach(PRTC.scene.add, PRTC.scene);
    
    PRTC.ball.addCollidingObjects(this.blocks);
  },
  
  addFloor: function () {
    var floorTexture = new THREE.ImageUtils.loadTexture( this.skyTexture );
  	var floorMaterial = new THREE.MeshLambertMaterial( 
  	  { map: floorTexture, side: THREE.BackSide } 
  	);
  	
  	var floorGeometry = new THREE.PlaneGeometry(4000, 1000, 10, 10);
  	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  	floor.position.z = 200;
  	floor.rotation.x = Math.PI / 2;
    PRTC.scene.add(floor);
  },
  
  addSky: function (){

    var skyTexture = new THREE.ImageUtils.loadTexture(this.skyTexture);
    var skyMaterial = new THREE.MeshBasicMaterial( 
      { map: skyTexture, side: THREE.BackSide } 
    );
    
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyMaterial );
    skyBox.scale.x = skyBox.scale.y = 2;

    skyBox.flipSided = true; 
    PRTC.scene.add(skyBox);
  },
  
  createBlock: function(position, size, name) {
    var material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture(this.floorTexture)
    });
    
    var cube = new THREE.Mesh(
      new THREE.CubeGeometry(
        size.width,
        size.height,
        size.dept
      ),
      material
    );
    
    cube.name = name;
    cube.position.set(position.x, position.y, position.z);
    
    return cube;
  }
}
