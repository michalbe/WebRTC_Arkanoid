var PRTC = PRTC || {};

PRTC.utils = {
  element: function utils_material(options) {
    if (!options || !options.material || !options.geometry)
      return;
    
    var material = new THREE['Mesh' + options.material +'Material']({
      map: THREE.ImageUtils.loadTexture(options.texture)
    });

    var geometry = new THREE.Mesh(
      THREE[options.geometry + 'Geometry'].apply(null, options.sizes), 
      material
    );
    
    return {
      material: material,
      geometry: geometry
    }
  }
}

var _u = PRTC.utils;