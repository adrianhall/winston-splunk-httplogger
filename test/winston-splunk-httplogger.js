var SplunkStreamEvent = require('..');
const { assert } = require('chai')

describe('createLogger', function () {
    it('should error without config', function() {
        assert.throws(function() {
            new SplunkStreamEvent();
        });
    });

    it('should error without a splunk object', function() {
        assert.throws(function() {
            new SplunkStreamEvent({});
        });
    });

    it('should error without a splunk token', function() {
        assert.throws(function() {
            new SplunkStreamEvent({ splunk: {} });
        });
    });

    it('should create a suitable logger with minimal config', function() {
        var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
        assert.ok(s instanceof SplunkStreamEvent);
    });

    it('should provide exitOnError as true by default', function() {
      var s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
      assert.isTrue(s.exitOnError);
    });

    it('should provide exitOnError as true by default when exitOnError value is not boolean', function() {
      var s = new SplunkStreamEvent({ splunk: { token: 'foo' }, exitOnError: 'false'});
      assert.isTrue(s.exitOnError);
    });

    it('should set exitOnError correctly', function() {
      var s = new SplunkStreamEvent({ splunk: { token: 'foo' }, exitOnError: false});
      assert.isFalse(s.exitOnError);
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
        assert.strictEqual('foo', s.server.eventFormatter);
    });
});

describe('log()', function() {
    var s;

    beforeEach(function() {
      s = new SplunkStreamEvent({ splunk: { token: 'foo' }});
    });

    describe('splunk payload generation from the `info` object', function() {
        var info = {
            message: 'non-canonical message',
            level: 'non-canonical level',
            anotherKey: 'foo bar'
        };
        info[Symbol.for('level')] = 'canonical level';
        info[Symbol.for('message')] = 'canonical message';

        it('sets the `severity` to the canonical `level`', function() {
            s.server = {
                send: function(payload) {
                    assert.strictEqual(payload.severity, 'canonical level');
                }
            };
            s.log(info);
        });

        it('sets the `msg` to the non-canonical `message`', function() {
            s.server = {
                send: function(payload) {
                    assert.strictEqual(payload.message.msg, info.message);
                }
            };
            s.log(info);
        });

        it('includes all other keys in the `meta`', function() {
            s.server = {
                send: function(payload) {
                    assert.deepStrictEqual(payload.message.meta, {
                        anotherKey: 'foo bar',
                        message: 'non-canonical message',
                        level: 'non-canonical level'
                    });
                }
            };
            s.log(info);
        });
    });

    it('sends the payload to splunk', function() {
        var called = false;
        s.server = {
            send: function(payload, callback) {
                called = true;
            }
        };
        s.log({});
        assert.ok(called, 'send() called');
    });

    it('calls the provided callback after payload transmission', function() {
        var called = false;
        s.server = {
            send: function(payload, callback) {
                callback();
            }
        };
        s.log({}, function() {
            called = true;
        });
        assert.ok(called, 'callback called');
    });

    it('triggers a `logged` event after payload transmission', function() {
        var called = false;
        s.on('logged', function() {
            called = true;
        });
        s.server = {
            send: function(payload, callback) {
                callback();
            }
        };
        s.log({}, function() {});
        assert.ok(called, 'event emitted');
    });

    it('triggers an `error` event if the payload transmission fails and emitOnError is true', function() {
        var called = false;
        s.on('error', function() {
            called = true;
        });
        s.server = {
            send: function(payload, callback) {
                callback(new Error());
            }
        };
        s.log({}, function() {});
        assert.ok(called, 'event emitted');
    });

    it('does not trigger an `error` event if the payload transmission fails and emitOnError is false', function() {
      s = new SplunkStreamEvent({ splunk: { token: 'foo' }, exitOnError: false});
      var called = false;
      s.on('error', function() {
        called = true;
      });
      s.server = {
        send: function(payload, callback) {
          callback(new Error());
        }
      };
      s.log({}, function() {});
      assert.ok(!called, 'event not emitted');
    });
});
