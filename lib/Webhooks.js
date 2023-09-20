'use strict';
const crypto = require('crypto');

const Webhook = {
  DEFAULT_TOLERANCE: 300000,	// in ms
  EXPECTED_SCHEME: 'v1',

  constructEvent(payload, header, secret, tolerance) {
		console.log('constructEvent', payload);
    this.verifyHeader(payload, header, secret, tolerance || this.DEFAULT_TOLERANCE);
		console.log('returning ', JSON.parse(payload));
    return JSON.parse(payload);
  },
  verifyHeader(
    encodedPayload,
    encodedHeader,
    secret,
    tolerance
  ) {
    const {
      decodedHeader: header,
      decodedPayload: payload,
      details,
    } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);

    const expectedSignature = crypto.createHmac('sha256', secret)
    .update(`${details.timestamp}.${encodedPayload.toString('utf8')}`)
    .digest('hex');

    for (var i=0; i<details.signatures.length; i++) {
      if (crypto.timingSafeEqual(Buffer.from(details.signatures[i]), Buffer.from(expectedSignature))) {

        const timestampAge = Date.now() - details.timestamp;
        if (tolerance > 0 && timestampAge > tolerance) {
          // @ts-ignore
          throw new Error('Timestamp outside the tolerance zone');
        }
        return true;
      }
    }

    throw new Error('Invalid signature');
  }
};

function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {

  const decodedPayload = Buffer.isBuffer(encodedPayload)
    ? encodedPayload.toString('utf8')
    : encodedPayload;
  if (Array.isArray(encodedHeader)) {
    throw new Error(
      'Unexpected: An array was passed as a header, which should not be possible for the qranswers--signature header.'
    );
  }
  const decodedHeader = Buffer.isBuffer(encodedHeader)
    ? encodedHeader.toString('utf8')
    : encodedHeader;
  const details = parseHeader(decodedHeader, expectedScheme);
  if (!details || details.timestamp === -1) {
    throw new Error('Unable to extract timestamp and signatures from header');
  }
  if (!details.signatures.length) {
    throw new Error('No signatures found with expected scheme');
  }
  return {
    decodedPayload,
    decodedHeader,
    details,
  };
};
function parseHeader(header, scheme) {
  if (typeof header !== 'string') {
    return null;
  }
  return header.split(',').reduce(
    (accum, item) => {
      const kv = item.split('=');
      if (kv[0] === 't') {
        accum.timestamp = parseInt(kv[1], 10);
      }
      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }
      return accum;
    },
    {
      timestamp: -1,
      signatures: [],
    }
  );
}
module.exports = Webhook;

