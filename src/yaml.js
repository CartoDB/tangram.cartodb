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
          drawGroupError1: { color: 'rgba(255,0,0,0.5)' }
        },
        visible: showErrorTiles
      },
      errorTileStripesLayer: {
        data: {
          layer: 'errorTileSquareLayer',
          source: 'CartoDB'
        },
        draw: {
          drawGroupError1: { color: 'rgba(255,0,0,0.5)' }
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
      errorTileStripesLayer: {
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

const generateYAML = function () {
  return yamljs.stringify(getBaseProperties(), 3);
};

const getBaseFile = function (showErrorTiles) {
  return URL.createObjectURL(new Blob([generateYAML(showErrorTiles)]));
};

module.exports.getBaseFile = getBaseFile;
