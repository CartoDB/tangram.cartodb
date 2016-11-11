let yamljs = require('yamljs');

const SOURCES = {
    mapnik: {
        type: 'MVT',
        url: function( url ) {
            return url.replace('{layerIndexes}', 'mapnik').replace('.png', '.mvt');
        }
    }
};

const getBaseProperties = function getBaseProperties() {
  return {
    global: {
      language: 'en'
    },

    cameras: {
      prespective: {
        type: 'perspective',
        vanishing_point: [ '0', '-250px' ],
        active: false
      },

      isometric: {
        type: 'isometric',
        axis: [ 0, 1 ],
        active: true
      },
      flat: {
        type: 'flat',
        active: false
      }
    },

    fonts: {
      Montserrat: {
        url: 'https://fonts.gstatic.com/s/montserrat/v7/zhcz-_WihjSQC0oHJ9TCYL3hpw3pgy2gAi-Ip7WPMi0.woff'
      }
    },

    layers: {}
  };
};

const generateYAML = function () {
  return yamljs.stringify( getBaseProperties(), 3);
};

const getBaseFile = function () {
  return URL.createObjectURL( new Blob( [ generateYAML() ] ) );
};

var yaml;
export default yaml = {
  getBaseFile
};
