import CCSS from 'tangram-cartocss';
import yaml from './yaml';

var SOURCES = {
    mapnik: {
        type: 'MVT',
        url: function( url ) {
            return url.replace('{layerIndexes}', 'mapnik').replace('.png', '.mvt');
        }
    }
};

var generateSources = function generateSources(url) {
  // TODO: make this dynamic if it is neccessary
  var source = SOURCES['mapnik'];

  return {
    type: source.type,
    url: source.url( url )
  };
};

var TC = function (map) {
  this.scene = Tangram.leafletLayer({
    scene: yaml.getBaseFile()
  }).addTo(map).scene;
};

TC.prototype = {
  addLayer: function (layer) {
    let config = CCSS.carto2Draw(layer.meta.cartocss);
    let ly = {
      data: {
        layer: layer.id,
        source: 'CartoDB'
      },
      draw: config.draw
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

    this.scene.updateConfig();
  },

  addDataSource: function (url) {
    this.scene.setDataSource('CartoDB', generateSources(url));
  }
};

export default TC;
