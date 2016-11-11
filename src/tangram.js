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
    let ly = {
      data: {
        layer: 'layer' + layer.source.match(/\d/g)[0],
        source: 'CartoDB'
      },
      draw: CCSS.carto2Draw(layer.meta.cartocss)
    };

    this.scene.config.layers[layer.layer_name] = ly;
    this.scene.updateConfig();
  },

  addDataSource: function (url) {
    this.scene.setDataSource('CartoDB', generateSources(url));
  }
};

export default TC;
