
var assert = require('assert');

var log = require('../includes/log.js');

describe('log.js', function() {

    describe('#check()', function() {
        it('should return false when the log is not present', function() {
            assert.equal(false, log.check());
        });
    });

    describe('#getid()', function() {
        it('should return an id of 1 when the log is not present', function() {
            assert.equal(1, log.getid());
        });
    });

});
