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
      flat: {
        type: 'flat',
        active: true
      }
    },
    styles: {
        polygons_blend: {
            base: 'polygons',
            blend: 'depthinlay'
        },
        lines_blend: {
            base: 'lines',
            blend: 'depthinlay'
        },
        points_blend: {
            base: 'points',
            blend: 'depthinlay'
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

var yaml;
export default yaml = {
  getBaseFile
};
