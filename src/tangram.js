import CCSS from 'tangram-cartocss';
import yaml from './yaml';
import md5 from 'md5';

var SOURCES = {
    mapnik: {
        type: 'MVT'
    }
};

var generateSources = function generateSources(url, subdomains) {
  // TODO: make this dynamic if it is neccessary
  var source = SOURCES['mapnik'];

  return {
    type: source.type,
    url: url,
    url_subdomains: subdomains
  };
};

var TC = function (map, cb) {
  let self = this;
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

};

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
    let sum = 0;
    for (var tile in this.scene.tile_manager.tiles ) {
      sum += this.scene.tile_manager.tiles[tile].debug.geometry_count;
    }

    return sum;
  },

  addLayer: function (layer, i) {
    let config = CCSS.carto2Draw(layer.meta.cartocss, i);

    config.forEach(l => {
      let ly = {
        data: {
          layer: layer.id,
          source: 'CartoDB'
        },
        draw: l.draw,
        visible: layer.visible
      };

      const layerName = md5(layer.id + l.name);

      this.scene.config.layers[layerName] = ly;

      Object.assign(
        this.scene.config.styles,
        l.styles
      );

      Object.assign(
        this.scene.config.textures,
        l.textures
      );
    });

    this.scene.updateConfig({rebuild: true});
  },

  addDataSource: function (url, subdomains) {
    this.scene.setDataSource('CartoDB', generateSources(url, subdomains));
  }
};

export default TC;
