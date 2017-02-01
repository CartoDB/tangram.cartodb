import CCSS from 'tangram-cartocss';
import yaml from './yaml';

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
  addLayer: function (layer) {
    let config = CCSS.carto2Draw(layer.meta.cartocss);
    let ly = {
      data: {
        layer: layer.id,
        source: 'CartoDB'
      },
      draw: config.draw,
      visible: layer.visible
    };

    this.scene.config.layers[layer.id] = ly;

    Object.assign(
      this.scene.config.styles,
      config.styles
    );

    Object.assign(
      this.scene.config.textures,
      config.textures
    );

    this.scene.updateConfig({rebuild: true});
  },

  addDataSource: function (url) {
    this.scene.setDataSource('CartoDB', generateSources(url));
  }
};

export default TC;
