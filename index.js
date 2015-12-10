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
 * @class SplunkStreamingEventLogger
 * @constructor
 * @param {object} options - Configuration settings for a new logger
 * @param {string} options.url - The URL of the Splunk endpoint
 * @param {string} options.token - the token for the Splunk endpoint
 */
var SplunkStreamingEventLogger = function (options) {
    /**
     * The name of this logging transport
     * @type {string}
     */
    this.name = 'SplunkStreamingEventLogger';

    /**
     * The minimum level to log
     * @type {string}
     */
    this.level = options.level || 'info';

    this.instance = splunk.Logger(options);
};

// Link the defined logger into the Winston system
util.inherits(SplunkStreamingEventLogger, winston.Transport);
winston.transports.SplunkStreamingEventLogger = SplunkStreamingEventLogger;

/**
 * Log a message to the transport.
 *
 * @method SplunkStreamingEventLogger.log
 * @param {string} level - the level of the log message
 * @param {string} msg - the message data
 * @param {object} meta - the meta data
 * @param {function} callback - the callback into the winston system
 */
SplunkStreamingEventLogger.prototype.log = function (level, msg, meta, callback) {

    console.log('SplunkStreamingEventLogger:');
    console.log('    Level = ', level);
    console.log('    Message = ', msg);
    console.log('    Meta = ', meta);

    callback(null, true);
}