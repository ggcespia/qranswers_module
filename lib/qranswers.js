'use strict'
function QRAnswers(key, config = {}) {
  if (!(this instanceof QRAnswers)) {
    return new QRAnswers(key, config);
  }
}
QRAnswers.webhooks = require("./Webhooks");
QRAnswers.prototype = {

};
module.exports = QRAnswers;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.Stripe = QRAnswers;
// Allow use with the TypeScript compiler without `esModuleInterop`.
// We may also want to add `Object.defineProperty(exports, "__esModule", {value: true});` in the future, so that Babel users will use the `default` version.
module.exports.default = QRAnswers;

