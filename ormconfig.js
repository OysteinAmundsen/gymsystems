/**
 * Since this is a workspace, some parts of the server app
 * concider this folder to be the servers root. In order to
 * keep DRY we just collect the export of the real ormconfig
 * and distribute it to whatever script who asks for it here.
 */
const config = require('./server/ormconfig.js');
module.exports = config;
