# winston-splunk-httplogger

A [Winston] transport for logging to [Splunk] with a [HTTP Event Collector].

## Installation

    npm install --save winston winston-splunk-httplogger

## Usage

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
