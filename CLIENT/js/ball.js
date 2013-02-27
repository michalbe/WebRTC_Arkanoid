var PRTC = PRTC || {};

PRTC.ball = {
  // flag for 'game' module
  updatable: true,
  
  texture: 'assets/ball-texture.jpg',
  material: null,
  radius: 20,
  segments: 16,
  rings: 16,
  sphere: null,
  velocityX: 3,
  velocityY: 4,
  rays: [
    new THREE.Vector3(0,  1, 0),
    new THREE.Vector3(1,  1, 0),
    new THREE.Vector3(1,  0, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-1,-1, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 1, 0)
  ],
  caster: new THREE.Raycaster(),
  
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
    // 
    // var originPoint = this.sphere.position.clone();
    // 
    //  for (var vertexIndex = 0; vertexIndex < this.sphere.geometry.vertices.length; vertexIndex++)
    //  {   
    //    var localVertex = this.sphere.geometry.vertices[vertexIndex].clone();
    //    var globalVertex = localVertex.applyMatrix4( this.sphere.matrix );
    //    var directionVector = globalVertex.sub( this.sphere.position );
    // 
    //    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
    //    var collisionResults = ray.intersectObjects( PRTC.level.cubes );
    //    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())  
    //      this.velocityX *= -1;
    //  }
    //  
    var distance = 30;
    for (i = 0; i < this.rays.length; i += 1) {
      this.caster.set(this.sphere.position, this.rays[i]);
      var collisions = this.caster.intersectObjects(PRTC.level.cubes);
      if (collisions.length > 0 && collisions[0].distance <= distance) {
        
       if ((i === 0 || i === 1 || i === 7)) {
         this.velocityY *= -1;
       }  else if ((i === 3 || i === 4 || i === 5)) {
         this.velocityY *= -1;
       }
       
       if ((i === 1 || i === 2 || i === 3)) {
         this.velocityX *= -1;
       } else if ((i === 5 || i === 6 || i === 7)) {
         this.velocityX *= -1;
       }
     }
    }
    
    this.sphere.position.x += this.velocityX;
    this.sphere.position.y += this.velocityY;
    this.sphere.rotation.x += -1*this.velocityY/60;
  }
}
