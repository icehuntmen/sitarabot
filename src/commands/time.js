module.exports = {
	name: 'time',
	description: 'Display info about yourself.',
	async execute(message, unite, args, guild, guildReady) {
		if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')


		/**
		 * Example:
		 * let j = schedule.scheduleJob('42 * * * *', function(){
		 * console.log('The answer to life, the universe, and everything!');
		 * });
		 *    *    *    *    *    *
		 ┬    ┬    ┬    ┬    ┬    ┬
		 │    │    │    │    │    │
		 │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
		 │    │    │    │    └───── month (1 - 12)
		 │    │    │    └────────── day of month (1 - 31)
		 │    │    └─────────────── hour (0 - 23)
		 │    └──────────────────── minute (0 - 59)
		 └───────────────────────── second (0 - 59, OPTIONAL)
		 *
		*/

		const schedule = unite.tasks
		const moment = unite.moment
		const timezone = unite.timezone

		let zone = timezone.tz.guess()

		devs.debug(zone)

		let mm = timezone.tz("2020-08-19 12:21:00",zone).format();
		devs.showObject(mm)
		let date = new Date(mm);
		let x = 'Tada!';

		if (args[0] === 'start') {
			let j = schedule.scheduleJob(message.id, '*/5 * * * * *', function (y) {
				devs.debug(y)
			});
		}

		devs.showObject(schedule.scheduledJobs)
		devs.showObject(args)

		if (args[0] === 'stop'){

			schedule.scheduledJobs.keys().cancel()
		}

	},
};
