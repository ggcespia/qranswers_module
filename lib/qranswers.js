'use strict';
const DEFAULT_HOST = 'api.qr-answers.com';
const DEFAULT_PORT = '443';
const DEFAULT_BASE_PATH = 'v1';
const DEFAULT_TIMEOUT = 80000;
const DEFAULT_API_VERSION = null;
QRAnswers.PACKAGE_VERSION = require('../package.json').version;
const utils = require('./utils');
const ALLOWED_CONFIG_PROPERTIES = [
  'timeout',
  'host',
  'port',
  'protocol',
];

function QRAnswers(key, config = {}) {
  if (!(this instanceof QRAnswers)) {
    return new QRAnswers(key, config);
  }
  const props = this._getPropsFromConfig(config);

  this.VERSION = QRAnswers.PACKAGE_VERSION;

  if (
    props.protocol &&
    props.protocol !== 'https' &&
    (!props.host || /\.qr-answers\.com$/.test(props.host))
  ) {
    throw new Error(
      'The `https` protocol must be used when sending requests to `*.qr-answers.com`'
    );
  }
  const agent = props.httpAgent || null;
  this._api = {
    auth: null,
    host: props.host || DEFAULT_HOST,
    port: props.port || DEFAULT_PORT,
    protocol: props.protocol || 'https',
    basePath: DEFAULT_BASE_PATH,
    version: props.apiVersion || DEFAULT_API_VERSION,
    timeout: utils.validateInteger('timeout', props.timeout, DEFAULT_TIMEOUT),
  };
  this._setApiKey(key);

  this.webhooks = require('./Webhooks');
  this.subscriptions = require('./Subscriptions');
  this.subscriptions.setKey(key);

}
QRAnswers.webhooks = require("./Webhooks");
QRAnswers.subscriptions = require("./Subscriptions");
QRAnswers.prototype = {
  VERSION: null,
  webhooks: null,
  _api: null,
  _setApiKey(key) {
    if (key) {
      this._setApiField('key', key);
    }
  },
  _setApiField(key, value) {
    this._api[key] = value;
  },
  getApiField(key) {
    return this._api[key];
  },
  getMaxNetworkRetries() {
    return this.getApiField('maxNetworkRetries');
  },

  /**
   * @private
   * This may be removed in the future.
   */
  _getPropsFromConfig(config) {
    if (!config) {
      return {};
    }
    const isObject = config === Object(config) && !Array.isArray(config);
    if (!isObject) {
      throw new Error('Config must be an object');
    }
    // If config is an object, we assume the new behavior and make sure it doesn't contain any unexpected values
    const values = Object.keys(config).filter(
      (value) => !ALLOWED_CONFIG_PROPERTIES.includes(value)
    );
    if (values.length > 0) {
      throw new Error(
        `Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(
          ', '
        )}`
      );
    }
    return config;
  },

};
module.exports = QRAnswers;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.QRAnswers = QRAnswers;
// Allow use with the TypeScript compiler without `esModuleInterop`.
// We may also want to add `Object.defineProperty(exports, "__esModule", {value: true});` in the future, so that Babel users will use the `default` version.
module.exports.default = QRAnswers;

