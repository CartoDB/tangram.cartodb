const CCSS = require('tangram-cartocss');
const yaml = require('./yaml');
const YAML = require('yamljs');


const tangramReference = require('tangram-reference').load();
const carto = require('carto');
const CartoCSSRenderer = new carto.RendererJS({
    reference: tangramReference,
    strict: true
});

function TC(map, cb) {
  this.layer = Tangram.leafletLayer({
    scene: yaml.getBaseFile()
  }).addTo(map);

  this.scene = this.layer.scene;

  this.scene.subscribe({
    load: () => {
      this.scene.setIntrospection(true);
      cb();
    }
  });
}

module.exports = TC;

function getSupportedCartoCSSResult(cartoCSS) {
  var result = { supported: true };
  try {
    let layers = CartoCSSRenderer.render(cartoCSS).getLayers();
    //CartoCSSRenderer make most checks against tangram-reference, but not all of them,
    //calling carto2Draw is the safe and easy approach, but it implies unnecesary overhead
    layers.forEach((l, i) => {
      CCSS.carto2Draw(l, i);
    });
  } catch (e) {
    result.supported = false;
    result.reason = e.message || 'unknown';
  }
  return result;
}

module.exports.getSupportedCartoCSSResult = getSupportedCartoCSSResult;

var SOURCES = {
    mapnik: {
        type: 'MVT'
    }
};

function generateSources(url, subdomains) {
  // TODO: make this dynamic if it is neccessary
  var source = SOURCES.mapnik;

  return {
    type: source.type,
    url: url,
    url_subdomains: subdomains
  };
}

TC.prototype = {
  onLoaded: function (cb) {
    this.scene.subscribe({
      view_complete: function () {
        cb();
      }
    });
  },

  addEvents: function (ev) {
    this.tangramLayer.setSelectionEvents(ev);
  },

  getTotalGeometries: function() {
    return Object.keys(this.scene.tile_manager.tiles).reduce((sum, tileId) => {
      return sum + this.scene.tile_manager.tiles[tileId].debug.geometry_count;
    }, 0);
  },


  //We receive a Builder's layer, that is composed by multiple sub-layers (draw-groups)
  addLayer: function (layer) {
    let layers = CartoCSSRenderer.render(layer.meta.cartocss).getLayers();

    layers.forEach((l, i) => {
      const yaml = CCSS.carto2Draw(l, i);
      let ly = {
        data: {
          layer: layer.id,
          source: 'CartoDB'
        },
        draw: yaml.draw,
        visible: layer.visible
      };

      const layerName = `layer_${i}`;

      this.scene.config.layers[layerName] = ly;

      Object.assign(
        this.scene.config.styles,
        yaml.styles
      );

      Object.assign(
        this.scene.config.textures,
        yaml.textures
      );
    });

    this.scene.updateConfig({rebuild: true});
  },

  addDataSource: function (url, subdomains) {
    this.scene.setDataSource('CartoDB', generateSources(url, subdomains));
  },

  toYAML: function () {
    return YAML.stringify(
      JSON.parse(
        JSON.stringify(this.scene.config, (key, value) => {
          if (typeof value === 'function') {
            return value.toString();
          }
          return value;
        })
      ),
    Number.POSITIVE_INFINITY, 4);
  }
};
