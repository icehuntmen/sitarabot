module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	async execute(message, unite, args, guild, guildReady) {
	if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')

		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	},
};
