/*
 * Copyright (C) 2015-2017 Adrian Hall
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
var util = require('util');
var winston = require('winston');
var isStream = require('is-stream');
var SplunkLogger = require('splunk-logging').Logger;

if (!isStream(new winston.Transport())) {
  console.error('winston-splunk-httplogger >= 2.0.0 is not compatiable with winston < 3.0.0.');
  throw new Error('winston-splunk-httplogger >= 2.0.0 is not compatiable with winston < 3.0.0.');
}

/**
 * A class that implements a Winston transport provider for Splunk HTTP Event Collector
 *
 * @param {object} config - Configuration settings for a new Winston transport
 * @param {string} [config.level=info] - the minimum level to log
 * @param {object} config.splunk - the Splunk Logger settings
 * @param {string} config.splunk.token - the Splunk HTTP Event Collector token
 * @param {string} [config.splunk.source=winston] - the source for the events sent to Splunk
 * @param {string} [config.splunk.sourcetype=winston-splunk-logger] - the sourcetype for the events sent to Splunk
 * @param {string} [config.splunk.host=localhost] - the Splunk HTTP Event Collector host
 * @param {number} [config.splunk.maxRetries=0] - How many times to retry the splunk logger
 * @param {number} [config.splunk.port=8088] - the Splunk HTTP Event Collector port
 * @param {string} [config.splunk.path=/services/collector/event/1.0] - URL path to use
 * @param {string} [config.splunk.protocol=https] - the protocol to use
 * @param {string} [config.splunk.url] - URL string to pass to url.parse for the information
 * @param {function} [config.splunk.eventFormatter] - Formats events, returning an event as a string, <code>function(message, severity)</code>
 * @param {string} [config.level=info] - Logging level to use, will show up as the <code>severity</code> field of an event, see
 *  [SplunkLogger.levels]{@link SplunkLogger#levels} for common levels.
 * @param {number} [config.batchInterval=0] - Automatically flush events after this many milliseconds.
 * When set to a non-positive value, events will be sent one by one. This setting is ignored when non-positive.
 * @param {number} [config.maxBatchSize=0] - Automatically flush events after the size of queued
 * events exceeds this many bytes. This setting is ignored when non-positive.
 * @param {number} [config.maxBatchCount=1] - Automatically flush events after this many
 * events have been queued. Defaults to flush immediately on sending an event. This setting is ignored when non-positive.
 * @param {function} [config.splunk.error] – A callback function for errors: <code>function(err, context)</code>.
 *
 * @constructor
 */
var SplunkStreamEvent = function (config) {
  winston.Transport.call(this, config);

  /** @property {string} name - the name of the transport */
  this.name = 'SplunkStreamEvent';

  /** @property {string} level - the minimum level to log */
  this.level = config.level || 'info';

  // Verify that we actually have a splunk object and a token
  if (!config.splunk || !config.splunk.token) {
    throw new Error('Invalid Configuration: options.splunk is invalid');
  }

  // If source/sourcetype are mentioned in the splunk object, then store the
  // defaults in this and delete from the splunk object
  this.defaultMetadata = {
    source: 'winston',
    sourcetype: 'winston-splunk-logger'
  };
  if (config.splunk.source) {
    this.defaultMetadata.source = config.splunk.source;
    delete config.splunk.source;
  }
  if (config.splunk.sourcetype) {
    this.defaultMetadata.sourcetype = config.splunk.sourcetype;
    delete config.splunk.sourcetype;
  }

  // This gets around a problem with setting maxBatchCount
  config.splunk.maxBatchCount = 1;
  this.server = new SplunkLogger(config.splunk);

  // Override the default error handler
  if (config.splunk.error) {
    this.server.error = config.splunk.error;
  }

  // Override the default event formatter
  if (config.splunk.eventFormatter) {
    this.server.eventFormatter = config.splunk.eventFormatter;
  }
};

util.inherits(SplunkStreamEvent, winston.Transport);

/**
 * Returns the configuration for this logger
 * @returns {Object} Configuration for this logger.
 * @public
 */
SplunkStreamEvent.prototype.config = function () {
  return this.server.config;
};

/**
 * Core logging method exposed to Winston.
 *
 * @function log
 * @member SplunkStreamEvent
 * @param {object} [info] - the log message info object
 * @param {function} callback - Continuation to respond to when complete
 */
SplunkStreamEvent.prototype.log = function (info, callback) {
  var self = this;
  var level = info[Symbol.for('level')];
  var msg = info['message'];
  const customSource = info['source'];
  const customSourcetype = info['sourcetype'];

  var payload = {
    message: {
      msg: msg
    },
    metadata: {
      source: customSource || this.defaultMetadata.source,
      sourcetype: customSourcetype || this.defaultMetadata.sourcetype
    },
    severity: level
  };

  this.server.send(payload, function () {
    self.emit('logged');
    callback(null, true);
  });
};

// Insert this object into the Winston transports list
winston.transports.SplunkStreamEvent = SplunkStreamEvent;

// Export the Winston transport
module.exports = exports = winston.transports.SplunkStreamEvent;
