module.exports = {
	name: 'link',
	description: 'Generated bot invite link',
	async execute(message, unite, args, guild, guildReady) {


		unite.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
			.then(link => {
				console.log(`Generated bot invite link: ${link}`);
				inviteLink = link;
			});
	},
};
