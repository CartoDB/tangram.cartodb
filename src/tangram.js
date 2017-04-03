import CCSS from 'tangram-cartocss';
import yaml from './yaml';
import md5 from 'md5';

var SOURCES = {
    mapnik: {
        type: 'MVT'
    }
};

var generateSources = function generateSources(url) {
  // TODO: make this dynamic if it is neccessary
  var source = SOURCES['mapnik'];

  return {
    type: source.type,
    url: url
  };
};

var TC = function (map) {
  let self = this;
  this.scene = Tangram.leafletLayer({
    scene: yaml.getBaseFile()
  }).addTo(map).scene;

  this.scene.subscribe({
    load: (e) => {
      if (this.scene.initialized) {
        this.scene.updateConfig();
      }
      else {
        setTimeout(() => this.scene.updateConfig(), 50);
      }
    }
  });
};

TC.prototype = {
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

  addDataSource: function (url) {
    this.scene.setDataSource('CartoDB', generateSources(url));
  }
};

export default TC;
