# [DEPRECATED] Tangram.cartodb [![Build Status](https://travis-ci.org/CartoDB/tangram.cartodb.svg?branch=master)](https://travis-ci.org/CartoDB/tangram.cartodb) ![No Maintenance Intended](https://img.shields.io/badge/No%20Maintenance%20Intended-%E2%9C%95-red.svg)

This is no longer supported.


![Uniform style](/demos/images/embed.png)

## Installation & usage

```bash
me$ npm i tangram-cartocss
// or
me$ yarn add tangram-cartocss
```

```javascript
import TC from 'tangram.cartodb';
```
## API

### *TC* constructor

#### `new TC`

```javascript
/**
 * Cartodb api to handle tangram maps.
 * @param  {LeafletMap} map   object with a leaflet map instance
 * @return {TangramScene}     return a Tangram wrapper with a complete api for cartodb.js
 */

var tangramScene = new TC(map);

```

#### `.addLayer`

```javascript
/**
 * Add a layer to Tangram instance.
 * @param  {Object} layer   layer object model
 */
tangramScene.addLayer(layer);
```

#### `.addDataSource`

```javascript
/**
 * Add a dataSource to Tangram instance.
 * @param  {String} url   tile url generated by cartodb.js
 */
tangramScene.addDataSource('http://flo.localhost.lan:8181/api/v1/map/flo@4d30aeba@77e23386655d49f11e3cc4e729105014:1478776666976/{sourceLayers}/{z}/{x}/{y}.png');
```

## Contributing

```sh
me$ git clone $repo_url
cd into_folder
yarn
yarn start
```

It will print the dev url to try the demos.

```sh
[0001] info  Server running at http://192.168.0.12:8000/ (connect)
[0001] info  LiveReload running on 35729
[0003] 43ms       1115B GET    200 /
[0003] 7ms         886B GET    200 /demos/css/main.css
[0004] 220ms       12KB GET    200 /demos/main.js
```

We use ES6 and Node > 6.X, I'm using 7.0 right now.


## Testing

Serve our testing application with

```sh
yarn watch
```

This will open a dev server in `http://10.0.32.188:8000` where you can load custom maps.

