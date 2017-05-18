var map = L.map( 'map' );

var tangram = new TangramCarto(map, function () {
  console.log(loaded);
});

tangram.addLayer();
