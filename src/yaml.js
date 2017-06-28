const yamljs = require('yamljs');

const getBaseProperties = function getBaseProperties() {
  return {
    global: {
      language: 'en'
    },
    fonts: {
      Montserrat: {
        url: 'https://fonts.gstatic.com/s/montserrat/v7/zhcz-_WihjSQC0oHJ9TCYL3hpw3pgy2gAi-Ip7WPMi0.woff'
      }
    },
    layers: {},
    styles: {
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
  return yamljs.stringify( getBaseProperties(), 3);
};

const getBaseFile = function () {
  return URL.createObjectURL( new Blob( [ generateYAML() ] ) );
};

module.exports.getBaseFile = getBaseFile;
