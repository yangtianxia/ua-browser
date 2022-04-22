'use strict';

if (process.env.ENV_NODE === 'production') {
  module.exports = require('./dist/browser.min.js')
} else {
  module.exports = require('./dist/browser.js')
}