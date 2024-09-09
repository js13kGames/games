class LowPoly {

  static addMappings(name, mapping) {
    return Object.assign({}, mapping, {
      'max-amplitude'             : name + '.maxAmplitude',
      'min-amplitude'             : name + '.minAmplitude',
      'seed'                      : name + '.seed',
    });
  }

  static addSchema(schema) {
    return Object.assign({}, schema, {
      // Randomness amplitude and variance.
      maxAmplitude      : {default: {x: 0.1, y: 0.1, z: 0.1}, type: 'vec3'},
      minAmplitude      : {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
      amplitudePDF      : {default: p => p},
      seed              : {default: "apples"},

      // Material.
      flatShading       : {default: true},
    });
  }

  static create(that, createGeometry) {
    const data = that.data,
          el = that.el;

    let material = el.components.material;
    let geometry = createGeometry(data);
    geometry.mergeVertices();
    LowPoly.randomizeVertices(data, geometry);

    if (!material) {
      material = {};
      material.material = new THREE.MeshPhongMaterial();
    }

    if (data.flatShading) {
      material.material.setValues({
        flatShading: true,
      });
    }

    that.mesh = new THREE.Mesh(geometry, material.material);
    el.setObject3D('mesh', that.mesh);
  }

  static randomizeVertices(data, geometry) {
      Random.seed(data.seed);
      for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
        v = geometry.vertices[i];

        LowPoly.randomizeVertexDimension(v, 'x', data.amplitudePDF, data.maxAmplitude.x, data.minAmplitude.x);
        LowPoly.randomizeVertexDimension(v, 'y', data.amplitudePDF, data.maxAmplitude.y, data.minAmplitude.y);
        LowPoly.randomizeVertexDimension(v, 'z', data.amplitudePDF, data.maxAmplitude.z, data.minAmplitude.z);
      }
      geometry.verticesNeedUpdate = true;
  }

  static randomizeVertexDimension(vertex, dim, amplitudePDF, maxAmplitude, minAmplitude) {
    let p = amplitudePDF(Random.random()),
        ori = 'o' + dim,
        amp = (maxAmplitude - minAmplitude) * p + minAmplitude;

    if (!(ori in vertex)) {
      vertex[ori] = vertex[dim];
    }
    vertex[dim] = vertex[ori] + amp;
  }
}

class LowPolyFactory {

  static simple(geometryName, createGeometry, properties) {
    var extendDeep = AFRAME.utils.extendDeep;

    // The mesh mixin provides common material properties for creating mesh-based primitives.
    // This makes the material component a default component and maps all the base material properties.
    var meshMixin = AFRAME.primitives.getMeshMixin();

    var defaultComponents = {};
    var componentName = 'low-poly-' + geometryName;
    defaultComponents[componentName] = {};

    var primitiveMapping = {};
    var componentSchema = {};

    for (const [key, value] of Object.entries(properties)) {
        var keyCamelCase = hyphenatedToCamel(key);
        primitiveMapping[key] = componentName + '.' + keyCamelCase;
        componentSchema[keyCamelCase] = {default: value};
    }

    AFRAME.registerPrimitive('lp-' + geometryName, extendDeep({}, meshMixin, {
      // Preset default components. These components and component properties will be attached to the entity out-of-the-box.
      defaultComponents: defaultComponents,
      mappings: LowPoly.addMappings(componentName, primitiveMapping)
    }));

    AFRAME.registerComponent(componentName, {
      schema: LowPoly.addSchema(componentSchema),

      play: function() {
        LowPoly.create(this, createGeometry);
      },

      update: function() {
        LowPoly.create(this, createGeometry);
      },

      remove: function () {
        this.el.removeObject3D('mesh');
      },

    });
  }
}

/**
 * Terrain
 **/

class LowPolyTerrain {

  static registerCurvature(componentName, computePosition) {
    AFRAME.registerComponent(componentName, {
      init: function() {
        this.curvature_initialized = false;
      },

      tick: function (time, delta) {
        if (!this.curvature_initialized) {
          // Place in tick, as tick occurs pre-render
          this.curvature_initialized = true;
          LowPolyTerrain.updateCurvature(this, computePosition);
        }
      },
    });
  }

  static updateCurvature(that, computePosition) {
    var geometry = that.el.getObject3D('mesh').geometry;
    var min = LowPolyTerrain.computeMinPosition(geometry.vertices);
    var max = LowPolyTerrain.computeMaxPosition(geometry.vertices);

    for (let v, i = 0, l = geometry.vertices.length; i < l; i++) {
      v = geometry.vertices[i];

      var position = computePosition(v, min, max);
      v.x = position.x;
      v.y = position.y;
      v.z = position.z;
      v.ox = position.x;
      v.oy = position.y;
      v.oz = position.z;
    }
    geometry.verticesNeedUpdate = true;
  }

  static computeMinPosition(vertices) {
    var min = {x: Infinity, y: Infinity, z: Infinity};
    for (let v, i = 0, l = vertices.length; i < l; i++) {
      v = vertices[i];
      min.x = Math.min(v.x, min.x);
      min.y = Math.min(v.y, min.y);
      min.z = Math.min(v.z, min.z);
    }
    return min;
  }

  static computeMaxPosition(vertices) {
    var max = {x: -Infinity, y: -Infinity, z: -Infinity};
    for (let v, i = 0, l = vertices.length; i < l; i++) {
      v = vertices[i];
      max.x = Math.max(v.x, max.x);
      max.y = Math.max(v.y, max.y);
      max.z = Math.max(v.z, max.z);
    }
    return max;
  }
}

/**
 * Cloning
 */

AFRAME.registerComponent('clone', {
	schema: {
		type: 'selector'
	},

  // originally taken from https://github.com/SamsungInternet/a-frame-components/blob/master/dist/clone.js
	init: function () {
		var clone = this.data.object3D.clone(true);
		clone.visible = true;
		this.el.setObject3D('clone', clone);
	}
});

/**
 * Utilities
 */

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function hyphenatedToCamel(hyphenated) {
  return lowercaseFirstLetter(hyphenated.split("-")
   .map(token => capitalizeFirstLetter(token))
   .join(""));
}

class Random {
  // Seeded prng
  // https://stackoverflow.com/a/47593316/4855984

  static seed(seed) {
    // Create a xfnv1a state:
    var seed = Random.xfnv1a(seed.toString());

    // output one 32-bit hash to produce the seed for mulberry32.
    this.random = Random.mulberry32(seed());
  }

  static xfnv1a(k) {
      for(var i = 0, h = 2166136261 >>> 0; i < k.length; i++)
          h = Math.imul(h ^ k.charCodeAt(i), 16777619);
      return function() {
          h += h << 13; h ^= h >>> 7;
          h += h << 3;  h ^= h >>> 17;
          return (h += h << 5) >>> 0;
      }
  }

  static mulberry32(a) {
      return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      }
  }

  static random() {
    return this.random();
  }
}
