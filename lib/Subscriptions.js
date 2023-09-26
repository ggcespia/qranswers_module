'use strict';
const {Amplify, API} = require('aws-amplify');

Amplify.configure({
	'aws_appsync_graphqlEndpoint': "https://sy35eokcbzcrvjomxqrx3xgawy.appsync-api.us-east-1.amazonaws.com/graphql",
	'aws_appsync_region': "us-east-1",
	'aws_appsync_authenticationType': "AWS_LAMBDA",	
})

const onResponseByClientId = /* GraphQL */ `
  subscription OnResponseByClientId($clientId: String!) {
    onResponseByClientId(clientId: $clientId) {
			clientId
			projectId
			baseId
			answerId
			count
    }
  }
`;
const onResponseBySpecificQuestion = /* GraphQL */ `
  subscription OnResponseBySpecificQuestion($baseId: String!) {
    onResponseBySpecificQuestion(baseId: $baseId) {
      clientId
      projectId
      baseId
      answerId
      count
    }
  }
`;

const getClientIdFromApiKey = /* GraphQL */ `
  query GetClientIdFromApiKey($apiKey: String!) {
    getClientIdFromApiKey(apiKey: $apiKey) {
      clientID
    }
  }
`;

const QRSubscription = {
	setKey(key) {
		this._apiKey = key;
	},
	async initialize() {
		const apiKey = this._apiKey;
		if (apiKey === undefined) {
			throw new Error("You must provide your API key when establishing the module. const qranswers = require('qranswers')(apiKey); ");
		}
		if (this.clientId !== undefined) {
			return true;
		}
		// We need to get our clientId from the server
		try {
			const qlResp = await API.graphql({
				query: getClientIdFromApiKey,
				variables: { apiKey: apiKey },
				authToken: this._apiKey
			});
			this._clientId = qlResp.data.getClientIdFromApiKey.clientID;
			return true;
		} catch (err) {
			console.warn(err);
			return false;
		}
	},
	subscribeToAllResponses(callBack, errCallBack) {
		if (this._clientId === undefined) {
			throw new Error('You must first call qranswers.subscriptions.initialize() before calling any subscription');
		}

		const subscription = API.graphql({
			query: onResponseByClientId,
			variables: { clientId: this._clientId },
			authToken: this._apiKey
		}
		).subscribe({
			next: ({ provider, value }) => {
				const response = value.data.onResponseByClientId;
				callBack(response);
			},
			error: (error) => {
				console.warn(error)
				if (errCallBack) {
					errCallBack(error);
				}
			},
		});
		return subscription;
	},
	unsubscribeToAllResponses(subscription) {
		subscription.unsubscribe();
	},
	subscribeToSpecificQuestionResponses(baseId, callBack, errCallBack) {
		if (baseId === undefined) {
			throw new Error('You must provide a baseId when subscribing to a specific question');
		}
		
		const subscription = API.graphql({
			query: onResponseBySpecificQuestion,
			variables: { baseId: baseId },
			authToken: this._apiKey
		}
		).subscribe({
			next: ({ provider, value }) => {
				const response = value.data.onResponseBySpecificQuestion;
				callBack(response);
			},
			error: (error) => {
				console.warn(error)
				if (errCallBack) {
					errCallBack(error);
				}
			},
		});
		return subscription;
	},
	unsubscribeToSpecificQuestionResponses(subscription) {
		subscription.unsubscribe();
	}
}

module.exports = QRSubscription;
//export default QRSubscription;
