const { exec } = require("child_process");
const simpleGit = require('simple-git');

module.exports = {
	name: 'git',
	description: 'Display info about yourself.',
	system: true,
	guildOnly: true,
	async execute(message, unite, args, guild, guildReady) {
		if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')

		const userPermissions = guild.me.permissions;
		if(!userPermissions.has('ADMINISTRATOR')) return message.channel.send('Доступ к данной функции Вам запрешен, обратитесь к администратору')

		//if(process.env.SERVER_STATUS !== 'true') return devs.warn('Is not server!', process.env.SERVER_STATUS)


		devs.info('Server data update!', process.env.SERVER_STATUS)
		switch(args[0]){
			case 'pull':
/*
				const GIT_SSH_COMMAND = 'git pull'
			const gh:simpleGit().env('GIT_SSH_COMMAND', GIT_SSH_COMMAND)
					.then((status) => { devs.showObject(status,2) })
*/
				break;
			case 'update':

				exec("npm install", (error, stdout, stderr) => {
					if (error) {
						console.log(`error: ${error.message}`);
						return;
					}
					if (stderr) {
						console.log(`stderr: ${stderr}`);
						return;
					}
					console.log(`pull: ${stdout}`);
				});

				break;
			case 'restart':
				exec("pm2 restart manager", (error, stdout, stderr) => {
					if (error) {
						console.log(`error: ${error.message}`);
						return;
					}
					if (stderr) {
						console.log(`stderr: ${stderr}`);
						return;
					}
					console.log(`restart pm2: ${stdout}`);
				});
				break;
		}




	},
};
