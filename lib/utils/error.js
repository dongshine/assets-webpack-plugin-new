var assign = require('lodash.assign');

module.exports = function pluginError (message, previousError) {
  var err = new Error('[AssetsWebpackPluginNew] ' + message);

  return previousError ? assign(err, previousError) : err;
};
