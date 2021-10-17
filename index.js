const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const Users = require('./models/Users');
const UsersStatistic = require('./models/UsersStatistic');
const fs = require('fs');
const dataRouter = require('./routers/data.routes');
const corsMiddleware = require('./middleware/cors.middleware');

const UsersFile = JSON.parse(fs.readFileSync('users.json'));
const UsersStatisticFile = JSON.parse(fs.readFileSync('users_statistic.json'));

const app = express();
const PORT = process.env.PORT || config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/data/', dataRouter);

async function start() {
	try {
		mongoose.connect(config.get('dbUrl'));

		const findUsers = await Users.findOne();
		const findUsersStatistic = await UsersStatistic.findOne();
		if (!findUsers) {
			Users.collection.insertMany(UsersFile);
		}
		if (!findUsersStatistic) {
			UsersStatistic.collection.insertMany(UsersStatisticFile);
		}

		app.listen(PORT, () => console.log(`Запущено сервер на порту ${PORT}`));
	} catch (error) {
		console.log(error);
	}
}
start();
