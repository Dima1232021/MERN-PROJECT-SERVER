const { Schema, model } = require('mongoose');

const Users = new Schema({
	id: { type: Number, required: true, unique: true },
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, required: true },
	ip_address: { type: String, required: true },
});

module.exports = model('users', Users, 'users');
