var PRTC = PRTC || {};

PRTC.level= {
  
  init: function() {
    
    this.addFloor();
    this.addSky();
    
    this.cubes = [
      this.createBlock({
        x: 400,
        y: 350,
        z: 0
      }, {
        width: 100,
        height: 700,
        dept: 100
      }, 'side'),
      this.createBlock({
        x: -400,
        y: 350,
        z: 0
      }, {
        width: 100,
        height: 700,
        dept: 100
      }, 'side'),
      this.createBlock({
        x: 0,
        y: 750,
        z: 0
      }, {
        width: 900,
        height: 100,
        dept: 100
      }, 'top')
    ];
    
    this.cubes.forEach(PRTC.scene.add, PRTC.scene);
  },
  
  addFloor: function () {
    var floorTexture = new THREE.ImageUtils.loadTexture( 'assets/floor.jpg' );
  	var floorMaterial = new THREE.MeshLambertMaterial( 
  	  { map: floorTexture, side: THREE.BackSide } 
  	);
  	
  	var floorGeometry = new THREE.PlaneGeometry(4000, 1000, 10, 10);
  	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  	floor.position.y = -0.5;
  	floor.rotation.x = Math.PI / 2;
    PRTC.scene.add(floor);
  },
  
  addSky: function (){

    var skyTexture = new THREE.ImageUtils.loadTexture( 'assets/sky.jpg' );
  	var skyMaterial = new THREE.MeshBasicMaterial( 
  	  { map: skyTexture, side: THREE.BackSide } 
  	);
  	
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  	var skyBox = new THREE.Mesh( skyBoxGeometry, skyMaterial );
    skyBox.flipSided = true; 
    skyBox.rotation.y = 2;  
    PRTC.scene.add(skyBox);
  },
  
  buildBorders: function(){
    
  },
  
  createBlock: function(position, size, name) {
    var material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture('assets/floor.jpg')
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
