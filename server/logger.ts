module.exports = require('bunyan').createLogger({
  name: 'gymsys',
  streams: [
    { level: 'trace', stream: process.stdout },
    { level: 'info', stream: process.stdout },
    {
      level: 'debug',
      type: 'rotating-file',
      path: './log/debug.log',
      period: '1d',   // daily rotation
      count: 3        // keep 3 back copies}
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: './log/error.log',
      period: '1d',   // daily rotation
      count: 3        // keep 3 back copies}
    }
  ]
});
