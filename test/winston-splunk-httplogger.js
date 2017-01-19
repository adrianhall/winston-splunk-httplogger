var SplunkStreamEvent = require('..');
var assert = require('assert');

describe('createLogger', function () {
    it('should error without config', function() {
        try {
            var s = new SplunkStreamEvent();
            assert.ok(false, 'Expected an error');
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should error without a splunk object', function() {
        try {
            var s = new SplunkStreamEvent({});
            assert.ok(false, 'Expected an error');
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should error without a splunk token', function() {
        try {
            var s = new SplunkStreamEvent({ splunk: {} });
            assert.ok(false, 'Expected an error');
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should create a suitable logger with minimal config', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.ok(s instanceof SplunkStreamEvent);
    });

    it('should provide a default level of info', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual('info', s.level);
    });

    it('should set the name property', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual('SplunkStreamEvent', s.name);
    });

    it('should store the token in the splunk config', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual('foo', s.config().token);
    });

    it('should provide a default host', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual('localhost', s.config().host);
    });

    it('should allow an override for the default host', function() {
        var s = new SplunkStreamEvent({ splunk: { host: 'bar', token: 'foo' }});
        assert.strictEqual('bar', s.config().host);
    });

    it('should provide a default port', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual(8088, s.config().port);
    });

    it('should allow an override for the default host', function() {
        var s = new SplunkStreamEvent({ splunk: { port: 2000, token: 'foo' }});
        assert.strictEqual(2000, s.config().port);
    });

    it('should set the maxBatchCount by default', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.strictEqual(1, s.config().maxBatchCount);
    });

    it('should allow an override for the default eventFormatter', function() {
        var s = new SplunkStreamEvent({ splunk: { eventFormatter: 'foo', token: 'foo' }});
        assert.strictEqual('foo', s.eventFormatter);
    });
});
