const C_QUESTION_FIELDS = ["text", "tags", "description"];
const C_ANSWER_FIELDS = ["text", "tags", "description", "imageUrl", "link", "linkAction", "linkDescription"];

const Api = {
	setKey(key) {
		this._apiKey = key;
		if (key !== undefined) {
			this._apiBase = 'https://api.qr-answers.com/v1';
		}
		// Allow key to be undefined for deferred initialization
	},
	initialize() {
		// do nothing..
	},
	async doFetch(url, method, params) {
		if (this._apiKey === undefined) {
			throw new Error("API key is required. Please set it using qranswers.setApiKey(apiKey) or initialize with require('qranswers')(apiKey)");
		}

		try {
			let result;

			let pack = {
				method: method || 'GET',
				headers: {
					Accept: '*/*',
					'Authorization': this._apiKey,
				}
			}

			if (params) {
				pack.headers['Content-Type'] = 'application/json';
				pack.body = JSON.stringify(params);
			}

			result = await fetch(url, pack);

			const json = await result.json();
			return json;
		} catch (err) {
			console.log(err);
			return {};
		}
	},

	async getApiKeyFromDbKey(baseId, dbKey) {
		const url = `${this._apiBase}/apikey/get/${baseId}/${dbKey}`;
		this._apiKey = dbKey;
		this._apiBase = 'https://api.qr-answers.com/v1';
		return await this.doFetch(url)
	},
	async getProjectList() {
		const url = `${this._apiBase}/projects/list`;
		return await this.doFetch(url)
	},
	async getProject(projectId) {
		const url = `${this._apiBase}/projects/${projectId}`;
		return await this.doFetch(url)
	},
	async getCampaignList(projectId, recordStatus) {
		if (typeof recordStatus === 'undefined') {
			recordStatus = 'active';
		}
		const url = `${this._apiBase}/campaigns/list/${projectId}?recordStatus=${recordStatus}`;
		return await this.doFetch(url)
	},
	async getCampaign(campaignId) {
		const url = `${this._apiBase}/campaigns/${campaignId}`;
		return await this.doFetch(url)
	},
	async getLocationList(projectId) {
		const url = `${this._apiBase}/locations/list/${projectId}`;
		return await this.doFetch(url)
	},
	async getLocation(locationId) {
		const url = `${this._apiBase}/locations/${locationId}`;
		return await this.doFetch(url)
	},
	async getQuestionList(projectId) {
		const url = `${this._apiBase}/questions/list/${projectId}`;
		return await this.doFetch(url)
	},
	async getQuestion(questionId) {
		const url = `${this._apiBase}/questions/${questionId}`;
		return await this.doFetch(url)
	},
	async getAnswerList(questionId) {
		const url = `${this._apiBase}/answers/list/${questionId}`;
		return await this.doFetch(url)
	},
	async getAnswer(answerId) {
		const url = `${this._apiBase}/answers/${answerId}`;
		return await this.doFetch(url)
	},
	async getQuestionAssignmentList(campaignId) {
		const url = `${this._apiBase}/questionassignments/list/${campaignId}`;
		return await this.doFetch(url)
	},
	async getQuestionAssignment(baseId) {
		const url = `${this._apiBase}/questionassignments/${encodeURIComponent(baseId)}`;
		return await this.doFetch(url)
	},
	async getResponseList(campaignId) {
		const url = `${this._apiBase}/responses/list/${campaignId}`;
		return await this.doFetch(url)
	},
	async getResponseListByProject(projectId) {
		const url = `${this._apiBase}/responses/listbyproject/${projectId}`;
		return await this.doFetch(url)
	},
	async getResponse(baseId) {
		const url = `${this._apiBase}/responses/${encodeURIComponent(baseId)}`;
		return await this.doFetch(url)
	},
	async getResponseDetailsList(campaignId) {
		const url = `${this._apiBase}/responsedetails/list/${campaignId}`;
		return await this.doFetch(url)
	},
	async getResponseDetailsListByProject(projectId) {
		const url = `${this._apiBase}/responsedetails/listbyproject/${projectId}`;
		return await this.doFetch(url)
	},
	async getResponseDetails(baseId) {
		const url = `${this._apiBase}/responsedetails/${encodeURIComponent(baseId)}`;
		return await this.doFetch(url)
	},
	async getSavedDashboard(gid) {
		const url = `${this._apiBase}/dashboards/${encodeURIComponent(gid)}`;
		return await this.doFetch(url)
	},
	async resetNotificationAggregate(id, idType, fieldName) {
		const url = `${this._apiBase}/notifications/aggregate/reset/${encodeURIComponent(id)}/${encodeURIComponent(idType)}?fieldName=${encodeURIComponent(fieldName)}`;
		return await this.doFetch(url, 'PUT')
	},
	async resetCampaignResponses(campaignId) {
		const url = `${this._apiBase}/responses/campaign/${encodeURIComponent(campaignId)}`;
		return await this.doFetch(url, 'PUT')
	},
	async resetQuestionAssignmentResponses(baseId) {
		const url = `${this._apiBase}/responses/questionassignments/${encodeURIComponent(baseId)}`;
		return await this.doFetch(url, 'PUT')
	},
	// Create/Update - these APIs require specific permissions to be able to call them.
	// Please contact support@qr-answers to get the permissions.

	// ** Project **
	// name, abbreviation, tags, description
	async createProject(projectParams) {
		const url = `${this._apiBase}/projects/create`;
		return await this.doFetch(url, 'POST', projectParams)
	},
	async updateProject(projectId, projectParams) {
		const url = `${this._apiBase}/projects/${projectId}`;
		return await this.doFetch(url, 'PUT', projectParams)
	},
	async deleteProject(projectId) {
		const url = `${this._apiBase}/projects/${projectId}`;
		return await this.doFetch(url, 'DELETE')
	},
	replaceID (params, idName, idValue) {
		if (!params) {
			params = {};
		}
		params[idName] = idValue;

		// make last letter of idName lowercase, remove that value from params if it exists
		const lastChar = idName.charAt(idName.length - 1).toLowerCase();
		const newIdName = idName.slice(0, -1) + lastChar;
		if (params.hasOwnProperty(newIdName)) {
			delete params[idName];
		}

		return params;
	},
	// Location
	// name, abbreviation, tags, description, projectId, latitude, longitude
	async createLocation(projectId, locationParams) {
		const pParams = this.replaceID(locationParams, "projectID", projectId);

		const url = `${this._apiBase}/locations/create/${projectId}`;
		return await this.doFetch(url, 'POST', pParams)
	},
	async updateLocation(locationId, projectId, locationParams) {
		let pParams = this.replaceID(locationParams, "projectID", projectId);
		pParams = this.replaceID(pParams, "locationID", locationId);

		const url = `${this._apiBase}/locations/${locationId}`;
		return await this.doFetch(url, 'PUT', pParams)
	},
	async canRemoveLocation(locationId, projectId) {
		const url = `${this._apiBase}/locations/canRemove/${locationId}/${projectId}`;
		return await this.doFetch(url)
	},
	async deleteLocation(locationId, projectId) {
		const url = `${this._apiBase}/locations/${locationId}`;
		return await this.doFetch(url, 'DELETE', {projectID: projectId})
	},
	// Question
	// text, tags, description, projectId
	async createQuestion(projectId, questionParams) {
		const pParams = this.replaceID(questionParams, "projectID", projectId);

		const url = `${this._apiBase}/questions/create/${projectId}`;
		return await this.doFetch(url, 'POST', pParams)
	},
	async updateQuestion(questionId, projectId, questionParams) {
		let pParams = this.replaceID(questionParams, "projectID", projectId);
		pParams = this.replaceID(pParams, "questionID", questionId);
		
		const url = `${this._apiBase}/questions/${questionId}`;
		return await this.doFetch(url, 'PUT', pParams)
	},
	async canRemoveQuestion(questionId, projectId) {
		const url = `${this._apiBase}/questions/canRemove/${questionId}/${projectId}`;
		return await this.doFetch(url)
	},
	async deleteQuestion(questionId, projectId) {
		const url = `${this._apiBase}/questions/${questionId}`;
		return await this.doFetch(url, 'DELETE', {projectID: projectId})
	},
	//Answer
	// projectID, text, iamgeUrl, tags, ansType, description, questionID, link, linkDescription, linkAction,
	// additionalInfo, groups..
	async createAnswer(questionId, projectId, answerParams) {
		let pParams = this.replaceID(answerParams, "projectID", projectId);
		pParams = this.replaceID(pParams, "questionID", questionId);

		const url = `${this._apiBase}/answers/create/${questionId}/${projectId}`;
		return await this.doFetch(url, 'POST', pParams)
	},
	async updateAnswer(answerId, questionId, projectId, answerParams) {
		let pParams = this.replaceID(answerParams, "projectID", projectId);
		pParams = this.replaceID(pParams, "questionID", questionId);
		pParams = this.replaceID(pParams, "answerID", answerId);

		const url = `${this._apiBase}/answers/${answerId}`;
		return await this.doFetch(url, 'PUT', pParams)
	},
	async canRemoveAnswer(answerId, questionId, projectId) {
		const url = `${this._apiBase}/answers/canRemove/${answerId}/${questionId}/${projectId}`;
		return await this.doFetch(url)
	},
	async deleteAnswer(answerId, questionId, projectId) {
		const url = `${this._apiBase}/answers/${answerId}`;
		return await this.doFetch(url, 'DELETE', {projectID: projectId, questionID: questionId})
	},
	// Question/Answers in bulk
	async createBulkQAFromString(projectId, pasteBuffer) {
		const url = `${this._apiBase}/questions/bulk/${projectId}`;
		return await this.doFetch(url, 'POST', {pasteBuffer: pasteBuffer})
	},
	async createBulkQAFromObject(projectId, qaObject) {
		// convert qrParams to pasteBuffer
		/*
		[{
			text: "What is your name?",
			tags: [{name: 'foo'}, {name: 'bar'}],
			description: "This is a question",
			answers: [
				{
				text: 'John',
				tags: [{name: 'foo'}, {name: 'bar'}],
				description: 'This is an answer',
				link: 'https://www.google.com',
				linkDescription: 'Google',
				linkAction: 'embed',
				imageUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
				},
				...
			],
		},
		...		  
		]
		*/
		let pasteBuffer = "";
		let qPadding = "";
		for (let i=0; i<C_QUESTION_FIELDS.length; i++) {
			pasteBuffer += 'question.' + C_QUESTION_FIELDS[i] + "\t";
			qPadding += "\t";
		}
		for (let i=0; i<C_ANSWER_FIELDS.length; i++) {
			if (i !== 0) {
				pasteBuffer += "\t";
			}
			pasteBuffer += 'answer.' + C_ANSWER_FIELDS[i];
		}
		pasteBuffer += "\n";

		for (let i = 0; i < qaObject.length; i++) {
			const question = qaObject[i];
			for (let j = 0; j < C_QUESTION_FIELDS.length; j++) {
				if (question.hasOwnProperty(C_QUESTION_FIELDS[j])) {
					if (C_QUESTION_FIELDS[j] === 'tags') {
						pasteBuffer += question[C_QUESTION_FIELDS[j]].map(t => t.name).join("|");
					} else {
						pasteBuffer += question[C_QUESTION_FIELDS[j]];
					}
				}
				pasteBuffer += "\t";
			}
			/*
			if (question.hasOwnProperty('text')) {
				pasteBuffer += question.text;
			}
			pasteBuffer += "\t";
			if (question.hasOwnProperty('tags')) {
				pasteBuffer += question.tags.map(t => t.name).join(",");
			}
			pasteBuffer += "\t";
			if (question.hasOwnProperty('description')) {
				pasteBuffer += question.description;
			}
			pasteBuffer += "\t";
			*/

			for (let j = 0; j < question.answers.length; j++) {
				if (j != 0) {
					pasteBuffer += qPadding;
				}
				
				const answer = question.answers[j];
				for (let k = 0; k < C_ANSWER_FIELDS.length; k++) {
					if (answer.hasOwnProperty(C_ANSWER_FIELDS[k])) {
						if (C_ANSWER_FIELDS[k] === 'tags') {
							pasteBuffer += answer[C_ANSWER_FIELDS[k]].map(t => t.name).join("|");
						} else {
							pasteBuffer += answer[C_ANSWER_FIELDS[k]];
						}
					}
					pasteBuffer += "\t";
				}
				/*
				if (answer.hasOwnProperty('text')) {
					pasteBuffer += answer.text;
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('tags')) {
					pasteBuffer += answer.tags.map(t => t.name).join(",");
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('description')) {
					pasteBuffer += answer.description;
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('imageUrl')) {
					pasteBuffer += answer.imageUrl;
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('link')) {
					pasteBuffer += answer.link;
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('linkDescription')) {
					pasteBuffer += answer.linkDescription;
				}
				pasteBuffer += "\t";
				if (answer.hasOwnProperty('linkAction')) {
					pasteBuffer += answer.linkAction;
				}
				*/
				pasteBuffer += "\n";

			}
		}

		return await this.createBulkQAFromString(projectId, pasteBuffer);
	},

	// Campaign
	// name, abbreviation, tags, description, disposition, projectID, clientID, settings, groups..
	/* settings: 
		{
				qr: {
						foreground: '#F000B4',
						background: '#FFFFFF',
						textLayout: {
							name: 'default',
						},
						shape: 'rect',
						imageLayout: {  					// puts image qr code at top left
							name: "topleft",        // centerright, topright, bottomleft, centerleft, bottomright
							objectFit: 'cover',
							opacity: 1.0,
					}
				},
				logoUrl: '',
				hdr: {
						text: QRLocalized("AddEditCampaign.please_join") 
				},
				chart: {
						name: 'HBar'		// None, HBar, Bar, Pie, Gradient Box
				}
		}
	*/
	async createCampaign(projectId, campaignParams) {
		let pParams = this.replaceID(campaignParams, "projectID", projectId);

		const url = `${this._apiBase}/campaigns/create/${projectId}`;
		return await this.doFetch(url, 'POST', pParams)
	},
	async updateCampaign(campaignId, projectId, campaignParams) {
		let pParams = this.replaceID(campaignParams, "projectID", projectId);

		const url = `${this._apiBase}/campaigns/${campaignId}`;
		return await this.doFetch(url, 'PUT', pParams)
	},
	async canRemoveCampaign(campaignId, projectId) {
		const url = `${this._apiBase}/campaigns/canRemove/${campaignId}/${projectId}`;
		return await this.doFetch(url)
	},
	async deleteCampaign(campaignId, projectId) {
		const url = `${this._apiBase}/campaigns/${campaignId}`;
		return await this.doFetch(url, 'DELETE', {projectID: projectId})
	},
	async archiveCampaign(campaignId, projectId, withDownload) {
		const url = `${this._apiBase}/campaigns/archive/${campaignId}/${projectId}?download=${withDownload ? true : false}`;
		return await this.doFetch(url, 'PUT', {})
	},
	async unarchiveCampaign(campaignId, projectId) {
		const url = `${this._apiBase}/campaigns/unarchive/${campaignId}/${projectId}`;
		return await this.doFetch(url, 'PUT', {});
	},
	// Question Assignments to Location(s) as part of a campaign (QuestionLocation table)
	// {projectId, campaignId, locationId, questions[]}
	// Uniqueness is campaignId + locationId - there can be only 1 w/ that combination
	async assignQuestionsToLocation(locationId, campaignId, questions) {
		const url = `${this._apiBase}/questionlocation/create/${locationId}/${campaignId}`;
		return await this.doFetch(url, 'POST', {questions: questions})
	},
	async updateQuestionsAtLocation(locationId, campaignId, questions) {
		const url = `${this._apiBase}/questionlocation/${locationId}/${campaignId}`;
		return await this.doFetch(url, 'PUT', {questions: questions})
	},
	async getQuestionsAtLocation(locationId, campaignId) {
		const url = `${this._apiBase}/questionlocation/${locationId}/${campaignId}`;
		return await this.doFetch(url)
	},
	async getQuestionsAtLocationList(campaignId) {
		const url = `${this._apiBase}/questionlocation/list/${campaignId}`;
		return await this.doFetch(url)
	},
	// Generate a PDF of the QR codes for the campaign
	// locations : [{locationId: <>},...]  array of locationIds with locationId as the key
	/* pdfParams: {
			photoLayoutName: 'topleft', 'centerright', 'topright', 'bottomleft', 'centerleft', 'bottomright'
			objectFit: 'cover', 'contain'
			opacity: 1.0
			showLocationName: true | false
			orientation: 'portrait' | 'landscape'
			decoration: 'standard' | 'plain_circle'
		}
			rest of params are taken from camapign.settings. pdfParams overwrite same value in settings
		qr: {
				foreground: '#F000B4',
				background: '#FFFFFF',
				textLayout: {
					name: 'default',
				},
				shape: 'rect',
				imageLayout: {
					name: "topleft",				pdfParams.photoLayoutName
					objectFit: 'cover',			pdfParams.objectFit
					opacity: 1.0,						pdfParams.opacity
			}
		},
		logoUrl: '',
		hdr: {
				text: QRLocalized("AddEditCampaign.please_join") 
		},
		chart: {
				name: 'HBar'		// None, HBar, Bar, Pie, Gradient Box
		}
	*/
	async generatePDFsForLocations(campaignId, projectId, locations, pdfParams) {
		const url = `${this._apiBase}/generate/pdf/${campaignId}/${projectId}`;
		return await this.doFetch(url, 'POST', {
			locations: locations,
			layoutParameters: pdfParams,
		})
	},
	/* 
	  answerParams = {
			questionLocationId: <>,
			locationId: <>,
			questionId: <>,
			answerId: <>,
		}
	  qrParams = {
			fg: '#000000', bg: '#FFFFFF', shape: 'rect', circle=true|false,
			format: 'svg' | 'png' | 'jpeg' | 'webp' | 'gif'

		}

	 */
	async getQRCodeForAnswer(campaignId, projectId, answerParams, qrParams) {
		const url = `${this._apiBase}/generate/qr/${campaignId}/${projectId}`;
		return await this.doFetch(url, 'POST', {answerParams: answerParams, qrParams: qrParams})
	},
	async getLoggedVotesByProject(projectId, campaignId, startDate, endDate) {
		let extraParams = '';
		let url = `${this._apiBase}/loggedvotes/log/${encodeURIComponent(projectId)}`;
		if (campaignId) {
			extraParams += `?campaignId=${encodeURIComponent(campaignId)}`;
		}
		if (startDate) {
			if (extraParams.length > 0) {
				extraParams += '&';
			} else {
				extraParams += '?';
			}
			extraParams += `startDate=${encodeURIComponent(startDate)}`;
		}
		if (endDate) {
			if (extraParams.length > 0) {
				extraParams += '&';
			} else {
				extraParams += '?';
			}
			extraParams += `endDate=${encodeURIComponent(endDate)}`;
		}
		if (extraParams.length > 0) {
			url += extraParams;
		}
		return await this.doFetch(url);
	}

}

module.exports = Api;
