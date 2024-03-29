
const Api = {
	setKey(key) {
		this._apiKey = key;
		const apiKey = this._apiKey;
		if (apiKey === undefined) {
			throw new Error("You must provide your API key when establishing the module. const qranswers = require('qranswers')(apiKey); ");
		}
		this._apiBase = 'https://api.qr-answers.com/v1';
	},
	initialize() {
		// do nothing..
	},
	async doFetch(url, method) {

		try {
			const result = await fetch(url, {
				method: method || 'GET',
				headers: {
					Accept: '*/*',
					'Authorization': this._apiKey,
				}
			});
			const json = await result.json();
			return json;
		} catch (err) {
			console.log(err);
			return {};
		}
	},

	async getProjectList() {
		const url = `${this._apiBase}/projects/list`;
		return await this.doFetch(url)
	},
	async getProject(projectId) {
		const url = `${this._apiBase}/projects/${projectId}`;
		return await this.doFetch(url)
	},
	async getCampaignList(projectId) {
		const url = `${this._apiBase}/campaigns/list/${projectId}`;
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
	}

}

module.exports = Api;
