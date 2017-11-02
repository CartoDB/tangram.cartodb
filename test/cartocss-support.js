const assert = require('assert');
const TC = require('../src/tangram');

describe('TC', function() {
    describe('#getSupportedCartoCSSResult()', function() {
        it('should return supported=true for valid CartoCSS', function() {
            var cartoCSS = '#layer { polygon-fill: red; }';
            var result = TC.getSupportedCartoCSSResult(cartoCSS);
            assert.ok(result.supported);
            assert.equal(result.reason, undefined);
        });

        it('should return supported=false with reason details', function() {
            var cartoCSS = '#layer { polygon-gamma-method: power; }';
            var result = TC.getSupportedCartoCSSResult(cartoCSS);
            assert.equal(result.supported, false);
            assert.ok(result.reason.indexOf('polygon-gamma-method')>=0);
        });
    });
});
