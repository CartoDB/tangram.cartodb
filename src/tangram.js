const CCSS = require('tangram-cartocss');
const yaml = require('./yaml');
const YAML = require('yamljs');

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
  return CCSS.getSupportResult(cartoCSS);
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
  addLayer: function (layer, superLayerOrder) {
    CCSS.cartoCssToDrawGroups(layer.meta.cartocss, superLayerOrder).forEach((scene, i) => {

      let ly = {
        data: {
          layer: layer.id,
          source: 'CartoDB'
        },
        draw: scene.draw,
        filter: scene.filter,
        visible: layer.visible
      };

      const layerName = `layer_${layer.id}_${i}`;

      this.scene.config.layers[layerName] = ly;

      Object.assign(
        this.scene.config.styles,
        scene.styles
      );

      Object.assign(
        this.scene.config.textures,
        scene.textures
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
