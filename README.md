# winston-splunk-httplogger

A [Winston] transport for logging to [Splunk] with a [HTTP Event Collector].

  [![Depedency Status](https://david-dm.org/adrianhall/winston-splunk-httplogger.svg)](https://david-dm.org/adrianhall/winston-splunk-httplogger)
  [![devDependency Status](https://david-dm.org/adrianhall/winston-splunk-httplogger/dev-status.svg)](https://david-dm.org/adrianhall/winston-splunk-httplogger?type=dev)

## Compatibility

[Winston] >= `3.0.0` is required for `winston-splunk-httplogger` >= `2.0.0`. Please use version `1.2.2` for legacy [Winston] support.

## Installation

```sh
npm install --save winston winston-splunk-httplogger
```

## Usage

```javascript
var winston = require('winston'),
    SplunkStreamEvent = require('winston-splunk-httplogger');

var splunkSettings = {
    token: process.env.SPLUNK_TOKEN,
    host: process.env.SPLUNK_HOST || 'localhost'
};

// Now use winston as normal
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console(),
        new SplunkStreamEvent({ splunk: splunkSettings })
    ]
});

logger.info('This is sent to Splunk');
```

## API

### splunkTransport = new SplunkStreamEvent(config);

Create a new instance of `SplunkStreamEvent`. Takes the following configuration:

 * **config:** configuration settings for the `SplunkStreamEvent` instance
 * **config.splunk:** the `Splunk Logger` settings
 * **config.splunk.token:** the Splunk HTTP Event Collector token
 * **[config.level=info]:** logging level to use, will show up as the `severity`
   field of an event
 * **[config.splunk.source=winston]:** the source for the events sent to Splunk
 * **[config.splunk.sourcetype=winston-splunk-logger]:** the sourcetype for the
   events sent to Splunk
 * **[config.splunk.host=localhost]:** the Splunk HTTP Event Collector host
 * **[config.splunk.maxRetries=0]:** how many times to retry the splunk logger
 * **[config.splunk.port=8088]:** the Splunk HTTP Event Collector port
 * **[config.splunk.path=/services/collector/event/1.0]:** URL path to use
 * **[config.splunk.protocol=https]:** the protocol to use
 * **[config.splunk.url]:** URL string to pass to `url.parse`. This will try to
   set `host`, `path`, `protocol`, `port`, `url`. Any of these values will be
  overwritten if the corresponding property is set on `config`
 * **[config.splunk.eventFormatter]:** formats events, returning an event as a
   string, `function(message, severity)`
 * **[config.batchInterval=0]:** automatically flush events after this many
   milliseconds. When set to a non-positive value, events will be sent one by
   one. This setting is ignored when non-positive
 * **[config.maxBatchSize=0]:** automatically flush events after the size of
   queued events exceeds this many bytes. This setting is ignored when
   non-positive
 * **[config.maxBatchCount=1]:** automatically flush events after this many
   events have been queued. Defaults to flush immediately on sending an
   event. This setting is ignored when non-positive

## Configuring Splunk

  1. Log into your Splunk instance as an Administrator
  2. Go to Settings &gt; Data Inputs
  3. Click on HTTP Event Collector under Local inputs
  4. Click on New Token
  5. Walk through the wizard to configure your new HTTP Event Collector

Splunk will provide you with a token at the end of the wizard.  You need to insert that
token into the splunk object you use to create the SplunkStreamEvent() object.  In the
example above, this is done by placing the token in the SPLUNK_TOKEN environment variable.

## See Also

  * [HTTP Event Collector]
  * [Splunk logging for JavaScript]

[Winston]: https://github.com/winstonjs/winston
[Splunk]: http://www.splunk.com
[HTTP Event Collector]: http://dev.splunk.com/view/event-collector/SP-CAAAE6M
[Splunk logging for JavaScript]: https://github.com/splunk/splunk-javascript-logging
