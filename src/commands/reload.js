module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	async execute(message, unite, args, guild) {
		const userPermissions = guild.me.permissions;
		if(!userPermissions.has('ADMINISTRATOR')) return message.channel.send('Доступ к данной функции Вам запрешен, обратитесь к администратору')

		const commandName = args[0].toLowerCase();
		const command = message.unite.commands.get(commandName)
			|| message.unite.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.unite.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};
