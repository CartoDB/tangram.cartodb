const yamljs = require('yamljs');

const getBaseProperties = function getBaseProperties(showErrorTiles) {
  return {
    global: {
      language: 'en'
    },
    fonts: {
      Montserrat: {
        url: 'https://fonts.gstatic.com/s/montserrat/v7/zhcz-_WihjSQC0oHJ9TCYL3hpw3pgy2gAi-Ip7WPMi0.woff'
      }
    },
    layers: {
      errorTileSquareLayer: {
        data: {
          layer: 'errorTileSquareLayer',
          source: 'CartoDB'
        },
        draw: {
          errorTileSquareStyle: { color: 'rgba(232, 236, 239, 0.16)' }
        },
        visible: showErrorTiles
      },
      errorTileStripesLayer: {
        data: {
          layer: 'errorTileStripesLayer',
          source: 'CartoDB'
        },
        draw: {
          errorTileStripesStyle: { color: 'rgba(254,177,0,0.64)',
          width: '1px'
        }
        },
        visible: showErrorTiles
      }
    },
    styles: {
      errorTileSquareStyle: {
        base: 'polygons',
        blend: 'overlay',
        blend_order: 99999
      },
      errorTileStripesStyle: {
        base: 'lines',
        blend: 'overlay',
        blend_order: 99999 + 1
      },

      polygons_blend: {
        base: 'polygons',
        blend: 'overlay'
      },
      lines_blend: {
        base: 'lines',
        blend: 'overlay'
      },
      points_blend: {
        base: 'points',
        blend: 'overlay'
      }
    }
  };
};

const generateYAML = function (showErrorTiles) {
  return yamljs.stringify(getBaseProperties(showErrorTiles), 3);
};

const getBaseFile = function (showErrorTiles) {
  return URL.createObjectURL(new Blob([generateYAML(showErrorTiles)]));
};

module.exports.getBaseFile = getBaseFile;
