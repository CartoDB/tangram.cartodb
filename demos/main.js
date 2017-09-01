import Carto from './lib/carto-helpers';
import Utils from './lib/utils';
import TangramCarto from '../src/tangram';

const MAP_URI = 'https://dmanzanares.carto.com/builder/68e825ce-5d96-42db-902f-e590fa69911a/embed';
const ZOOM = 2;
const CENTER = [42.34, -71.0];
const BASE_MAP = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';


window.map = window.L.map('map');
window.Tangram = Tangram;
window.L.tileLayer(BASE_MAP).addTo(map);
window.TC = new TangramCarto(map, function () { });

var app = new Vue({
  el: '#gui',
  data: {
    uri: MAP_URI,
    layers: []
  },

  methods: {
    send: function (ly) { },
    loadVizJSON: function (uri) {
      let self = this;
      return Utils.spawn(function* () {

        let vizUri = Carto.generateVizUri(uri),
          viz = yield Carto.getVizJSON(vizUri),
          jpUri = Carto.generateJSONPUri(viz),
          jsonP = yield Carto.getJSONP(jpUri);
        TC.addDataSource(Carto.generateSource(viz.datasource));
        let jpLayers = jsonP.metadata.layers;

        viz.layers.forEach((ly, i) => {
          if (ly.type === 'CartoDB') {
            let layer = {
              id: jpLayers[i].id,
              opened: false,
              cartocss: jpLayers[i].meta.cartocss,
              name: ly.options.layer_name
            };

            self.layers.push(layer);
            console.log(jpLayers[i]);
            TC.addLayer(jpLayers[i], i);
          }
        });

      });
    }
  }
});


map.setView(CENTER, ZOOM);
