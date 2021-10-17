const Router = require('express');
const Users = require('../models/Users');
const UsersStatistic = require('../models/UsersStatistic');
const moment = require('moment');

const router = Router();

router.post('/users', async (req, res) => {
	try {
		const { limitElements, currentlyPage } = req.body;

		let skipUsers = currentlyPage * limitElements - limitElements;

		let totalUsers = await Users.count();

		let numberOfPages = Math.ceil(totalUsers / limitElements);

		let users = await Users.find({}, null, {
			skip: skipUsers,
			limit: limitElements,
		});
		const updatedUserData = await Promise.all(
			users.map(async event => {
				let sumPage_views = 0;
				let sumClicks = 0;
				let newUser = await UsersStatistic.find({ user_id: event.id });

				newUser.map(data => {
					sumPage_views += data.page_views;
					sumClicks += data.clicks;
				});

				return {
					id: event.id,
					first_name: event.first_name,
					last_name: event.last_name,
					email: event.email,
					gender: event.gender,
					ip_address: event.ip_address,
					page_views: sumPage_views,
					clicks: sumClicks,
				};
			})
		);
		res.json({ userData: updatedUserData, pages: numberOfPages });
	} catch (e) {
		console.log(e);
		res.send({ message: 'Помилка сервера' });
	}
});

router.post('/user/:id', async (req, res) => {
	try {
		const user_id = req.params.id;
		const { startDate, endDate } = req.body;

		const startDateFormat = moment(startDate).subtract(1, 'day');
		const endDateFormat = moment(endDate);
		const daysDifference = endDateFormat.diff(startDateFormat, 'days');

		let cloneDay = startDateFormat.clone();
		const daysArray = [...Array(daysDifference)].map(() => ({
			date: cloneDay.add(1, 'day').clone().format('YYYY-MM-DD'),
			page_views: 0,
			clicks: 0,
		}));

		const updatedList = await Promise.all(
			daysArray.map(async currentValue => {
				let userData = await UsersStatistic.findOne({
					user_id,
					date: `${currentValue.date}`,
				});

				if (userData) {
					return {
						date: userData.date,
						page_views: userData.page_views,
						clicks: userData.clicks,
					};
				}

				return currentValue;
			})
		);

		res.json({ userDataArray: updatedList });
	} catch (e) {
		console.log(e);
		res.send({ message: 'Помилка сервера' });
	}
});

module.exports = router;
