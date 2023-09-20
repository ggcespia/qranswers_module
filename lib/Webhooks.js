'use strict';

const Webhook = {
 	DEFAULT_TOLERANCE: 300,
	signature: null,
	constructEvent(payload, header, secret) {
		this.signature.verifyHeader(
			payload,
			header,
			secret,
			tolerance || Webhook.DEFAULT_TOLERANCE,
		);
    		// @ts-ignore
    		const jsonPayload = JSON.parse(payload);
    		return jsonPayload;
	},
};
module.exports = Webhook;

