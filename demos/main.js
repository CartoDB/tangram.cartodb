import Carto from './lib/carto-helpers';
import Utils from './lib/utils';
import TangramCarto from '../src/module';
var map = window.L.map( 'map' );

window.L.tileLayer( 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '<a href="http://carto.com">CARTO</a> © 2016',
    maxZoom: 18
} ).addTo( map );

window.tc = new TangramCarto(map, function () {
  console.log('loaded!');
});

var app = new Vue({
	el: '#gui',
	data: {
    // uri: 'https://eschbacher.carto.com/api/v3/viz/2ebfd01c-1d2f-11e6-85b7-0e31c9be1b51/viz.json?callback=_cdbc_73909',
		uri: 'https://eduardorodes.carto.com/builder/2c212118-b711-11e6-9e07-0ef7f98ade21/embed',
    // uri: 'https://flopez2.carto.com/builder/27a982d0-bdea-11e6-8daa-0e05a8b3e3d7/',
		layers: [
		]
	},

	methods: {
		send: function (ly) {
			// TH.setLayerDraw(window.sceneLayer, ly);
			// window.sceneLayer.updateConfig();
		},
		loadVizJSON: function (uri) {
			let self = this;
			return Utils.spawn(function*() {

				let vizUri = Carto.generateVizUri(uri),
						viz = yield Carto.getVizJSON(vizUri),
						jpUri = Carto.generateJSONPUri(viz),
						jsonP = yield Carto.getJSONP(jpUri);

				tc.addDataSource(Carto.generateSource(viz.datasource));
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
						tc.addLayer(jpLayers[i], i);
					}
				});

			});
		}
	}
});


map.setView( [48.72, 2.48], 9 );
