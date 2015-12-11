/*
 * Copyright (C) 2015 Adrian Hall
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var util = require('util'),
    winston = require('winston'),
    splunk = require('splunk-logging');

/**
 * A class that implements the Winston transport for a Splunk HTTP Event Collector
 *
 * @property {string} name - the name of the transport
 * @property {string} level - the minimum level to send@
 * @property {splunk-logging} instance - the instance of the Splunk Logger
 *
 * @class SplunkStreamingEvent
 * @constructor
 * @param {object} options - Configuration settings for a new logger
 * @param {string} options.url - The URL of the Splunk endpoint
 * @param {string} options.token - the token for the Splunk endpoint
 */
var SplunkStreamingEvent = function (options) {
    /**
     * The name of this logging transport
     * @type {string}
     */
    this.name = 'SplunkStreamingEvent';

    /**
     * The minimum level to log
     * @type {string}
     */
    this.level = options.level || 'info';

    /**
     * Mocking Support - specify the Splunk instance
     * @type {splunk-logging}
     */
    this.splunkLibrary = options.splunkSDK || splunk;

    // Create an instance of the splunk logger
    if (!options.url)
        throw new Error('winston-splunk-httplogger requires a url option');
    if (!options.token)
        throw new Error('winston-splunk-httplogger requires a token option');
    this.server = splunk.Logger(options);
};

/**
 * @extends winston.Transport
 */
util.inherits(SplunkStreamingEvent, winston.Transport);

/**
 * Define a getter so that 'winston.transports.SplunkStreamingEvent
 * is available and thus backwards compatible
 */
winston.transports.SplunkStreamingEvent = SplunkStreamingEvent;

/**
 * Core logging method exposed to Winston.
 *
 * @function log
 * @member SplunkStreamingEvent
 * @param {string} level - the level at which to log the message
 * @param {string} msg - the message to log
 * @param {object} [meta] - any additional meta data to attach
 * @param {function} callback - Continuation to respond to when complete
 */
SplunkStreamingEvent.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    if (meta instanceof Error) {
        meta = {
            errmsg: meta.message,
            name: meta.name,
            stack: meta.stack
        };
    }

    console.log('SplunkStreamingEventLogger:');
    console.log('    Level = ', level);
    console.log('    Message = ', msg);
    console.log('    Meta = ', meta);

    var payload = {
        message: {
            msg: msg
        },
        metadata: {
            source: 'winston',
            sourcetype: 'winston-splunk-logger'
        },
        severity: level
    }

    if (meta) {
        if (meta instanceof Error) {
            payload.message.meta = {
                error: meta.message,
                name: meta.name,
                stack: meta.stack
            };
        } else {
            payload.message.meta = meta;
        }
    }

    this.server.send(payload, function (err, resp, body) {
        if (err)
            self.emit('error', err);
        self.emit('logged');
        callback(null, true);
    });
};

module.exports = exports = winston.transports.SplunkStreamingEventLogger;
