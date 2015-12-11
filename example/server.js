var winston = require('winston');
var SplunkStreamEvent = require('..');

var splunkConfig = {
    host: process.env.SPLUNK_HOST || 'localhost',
    token: process.env.SPLUNK_TOKEN
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console(),
        new SplunkStreamEvent({ splunk: splunkConfig })
    ],
    level: 'debug'
});

logger.debug('This is a debug message');
logger.info('This is an error message');
logger.error('This is an error message');
