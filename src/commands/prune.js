module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	type: 'system',
	system: true,
	permissions: ['ADMINISTRATOR'],
	async execute(message, unite, args, guild, guildReady) {
		if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.channel.send('that doesn\'t seem to be a valid number.');
		} else if (amount <= 1 || amount > 100) {
			return message.channel.send('you need to input a number between 1 and 99.');
		}
		devs.debug(amount, typeof amount)
		message.channel.bulkDelete(amount).then(() => {
			message.channel.send(`Deleted ${amount} messages.`)//.then(msg => msg.delete(3000));
		}).catch((e) => {

			devs.error(e);
		});

		// message.channel.bulkDelete(amount).catch(err => {
		// 	console.error(err);
		// 	message.channel.send('there was an error trying to prune messages in this channel!');
		// });
	},
};
