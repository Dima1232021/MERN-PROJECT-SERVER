const { Schema, model } = require('mongoose');

const UsersStatistic = new Schema({
	user_id: { type: Number, required: true },
	date: { type: String, required: true },
	page_views: { type: Number, required: true },
	clicks: { type: Number, required: true },
});

module.exports = model('users_statistic', UsersStatistic, 'users_statistic');
