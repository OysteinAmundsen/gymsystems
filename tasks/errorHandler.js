'use strict';

const notify  = require('gulp-notify');

/****************************************
 * Standard error handler
 ****************************************/
module.exports = function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title  : "Compile Error",
        message: "<%= error %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};
