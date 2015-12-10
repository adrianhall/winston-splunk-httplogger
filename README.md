# winston-splunk-httplogger

A [Winston] transport for logging to a [Splunk] [HTTP Event Collector].

## Installation

    npm install --save winston winston-splunk-httplogger

## Usage

    var winston = require('winston'),
        splunkLogger = require('winston-splunk-httplogger');

    var options = {
        level: 'info',

        // This is your Splunk Instance Infromation
        url: 'https://splunk.local:8088',
        token: 'MY-TOKEN'
    };

    winston.add(splunkLogger, options);

    // Now use winston as normal

## Configuring Splunk

## See Also

  * [Splunk logging for JavaScript]

[Winston]: https://github.com/winstonjs/winston
[Splunk]: http://www.splunk.com
[HTTP Event Collector]: http://dev.splunk.com/view/event-collector/SP-CAAAE6M
[Splunk logging for JavaScript]: https://github.com/splunk/splunk-javascript-logging
