module.exports = {
	name: 'info',
	description: 'Display info about yourself.',
	async execute(message, unite, args, guild, guildReady) {
		if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')



			/*
            message.channel.send('Test').then(msg => {
                console.log(msg.id);
                console.log(JSON.stringify(msg,null,4));
            })

             */
		//let msg = await translate('Hello world', { to: 'es' });
		// const res = await translator.translate('Привет чувак')
		// 	.catch(err => {
		// 		console.error(err);
		// 	});

		//devs.showObject(res)
/*
		const filter = m => m.content

		message.channel.send(`Введите данные ${message.id}`).then(() => {
			message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					message.channel.send(`${JSON.stringify(collected,null,4)}`,{code:'json'});
				})
				.catch(collected => {
					message.channel.send('Looks like nobody got the answer this time.');
				});
		});*/

	}
};


