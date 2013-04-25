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
  velocityX: ~~(Math.random()*11),
  velocityY: -4,
  collides: [],
  
  distance: 20,
  caster: new THREE.Raycaster(),
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
    
    this.sphere.position.y = 100;
    PRTC.scene.add(this.sphere);
  },
      
  addCollidingObjects: function(objects) {
    this.collides = this.collides.concat(objects);
  },
  
  update: function ball_update() {
    for (i = 0; i < this.rays.length; i += 1) {
      this.caster.set(this.sphere.position, this.rays[i]);
      var collisions = this.caster.intersectObjects(this.collides);
      if (collisions.length > 0 && collisions[0].distance <= this.distance) {

        //console.log(collisions[0].object.name);
       // if (collisions[0].object.name === 'paddle') {
       //   this.velocityY *= 1.1;//~~(Math.random()*10) * this.velocityY > 0 ? 1 : -1;
       // } else if (collisions[0].object.name === 'top') {
       //    this.velocityY *= 0.8;
       // }
       // 
       if ((i === 0 || i === 1 || i === 7)) {
         this.velocityY *= -1;
         //this.velocityY = (this.velocityY*-1) + ~~(Math.random()*6)-3;
       }  else if ((i === 3 || i === 4 || i === 5)) {
         this.velocityY *= -1;
         //this.velocityY = (this.velocityY*-1) + ~~(Math.random()*6)-3;
       }
       
       if ((i === 1 || i === 2 || i === 3)) {
         this.velocityX *= -1;
         //this.velocityX = (this.velocityX*-1) + ~~(Math.random()*6)-3;
       } else if ((i === 5 || i === 6 || i === 7)) {
         this.velocityX *= -1;
         //this.velocityX = (this.velocityX*-1) + ~~(Math.random()*6)-3;
       }
     }
    }
    
    if (this.sphere.position.y < 0) {
      this.sphere.position.y = 200;
    }
    this.sphere.position.x += this.velocityX;
    this.sphere.position.y += this.velocityY;
    this.sphere.rotation.x += -1*this.velocityY/60;
    this.sphere.rotation.y += this.velocityX/60;
  }
}
