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
    SplunkLogger = require('splunk-logging').Logger;

/**
 * A class that implements a Winston transport provider for Splunk HTTP Event Collector
 *
 * @param {object} config - Configuration settings for a new Winston transport
 * @param {string} [config.level=info] - the minimum level to log
 * @param {object} config.splunk - the Splunk Logger settings
 * @param {string} config.splunk.token - the Splunk HTTP Event Collector token
 * @param {string} [config.splunk.host=localhost] - the Splunk HTTP Event Collector host
 * @param {number} [config.splunk.maxRetries=0] - How many times to retry the splunk logger
 * @param {number} [config.splunk.port=8088] - the Splunk HTTP Event Collector port
 * @param {string} [config.splunk.path=/services/collector/event/1.0] - URL path to use
 * @param {string} [config.splunk.protocol=https] - the protocol to use
 * @param {string} [config.splunk.url] - URL string to pass to url.parse for the information
 * @param {string} [config.level=info] - Logging level to use, will show up as the <code>severity</code> field of an event, see
 *  [SplunkLogger.levels]{@link SplunkLogger#levels} for common levels.
 * @param {number} [config.batchInterval=0] - Automatically flush events after this many milliseconds.
 * When set to a non-positive value, events will be sent one by one. This setting is ignored when non-positive.
 * @param {number} [config.maxBatchSize=0] - Automatically flush events after the size of queued
 * events exceeds this many bytes. This setting is ignored when non-positive.
 * @param {number} [config.maxBatchCount=1] - Automatically flush events after this many
 * events have been queued. Defaults to flush immediately on sending an event. This setting is ignored when non-positive.
 *
 * @constructor
 */
var SplunkStreamingEvent = function (options) {
    /** @property {string} name - the name of the transport */
    this.name = 'SplunkStreamingEvent';

    /** @property {string} level - the minimum level to log */
    this.level = options.level || 'info';

    // Verify that we actually have a splunk object and a token
    if (!options.splunk || !options.splunk.token) {
        throw new Error('Invalid Configuration: options.splunk is invalid');
    }
    console.info('SPLUNK OBJECT: ', options.splunk);
    this.server = new SplunkLogger(options.splunk);
};
util.inherits(SplunkStreamingEvent, winston.Transport);

/**
 * Returns the configuration for this logger
 * @return {Object} Configuration for this logger.
 * @public
 */
SplunkStreamingEvent.prototype.config = function() {
    return this.server.config;
};

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

    var payload = {
        message: {
            msg: msg
        },
        metadata: {
            source: 'winston',
            sourcetype: 'winston-splunk-logger'
        },
        severity: level
    };

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
        if (err) self.emit('error', err);
        self.emit('logged');
        callback(null, true);
    });
};

// Insert this object into the Winston transports list
winston.transports.SplunkStreamingEvent = SplunkStreamingEvent;

// Export the Winston transport
module.exports = exports = winston.transports.SplunkStreamingEvent;
