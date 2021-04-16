module.exports = {
	name: 'private',
	description: 'Создание канала для приватных сообщений',
	async execute(message, unite, args, guild, guildReady) {
		if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')

		/**
		 * Определяем гильдию и выбираем управление гильдией
		 */
		const { GuildsManager } = unite.unitebot
		const { guildSchema } = unite.models
		const gm = new GuildsManager(unite,guild)

		// Проверяем наличие гильдии в базе ? определяем функционал : сообщем в канал о том что гильдия не  присутвует в базе
		if(await gm.isExist){

			let type = '';
			const argsUser = unite.getUserFromMention(args[0],guild)

			if(argsUser.status){type = 'user'} else { type = args[0]}
			const p = await guildSchema.getPrivateChannelID(guild.id)

			switch(type) {

				case "create": {

					return devs.debug('Create private Category')
				}
				case "persona": {

					if(p.privateChannelID === undefined || p.privateChannelID === null) return devs.error('Отсутвует приватная категория');
					const argsPersona = unite.users.cache.get(args[1])
					const discriminatorPersona = argsPersona.discriminator
					const isChannelPersona = guild.channels.cache.some(channel => channel.name === discriminatorPersona)
					const isParentPersona = guild.channels.cache.some(channel => channel.id === p.privateChannelID)
					if(!isChannelPersona){
						await guild.channels.create(discriminatorPersona, {parent: p.privateChannelID , topic: `Приватный канал ${argsPersona.tag}` })
							.then(logger => devs.debug(logger))
							.catch(error => devs.error(error));
					} else {
						devs.debug(`Channel ${discriminatorPersona} is ready`)
					}

					return devs.debug('Create private Category')
				}
				case "user": {

					if(p.privateChannelID === undefined || p.privateChannelID === null) return devs.error('Отсутвует приватная категория');
					const discriminator = argsUser.member.user.discriminator
					const isChannel = guild.channels.cache.some(channel => channel.name === discriminator)
					const isParent = guild.channels.cache.some(channel => channel.id === p.privateChannelID)
					devs.showObject(isParent)
					if(!isChannel){
						await guild.channels.create(discriminator, {parent: p.privateChannelID , topic: `Приватный канал ${argsUser.member.user.tag}` })
							.then(logger => devs.debug(logger))
							.catch(error => devs.error(error));
					} else {
						devs.debug(`Channel ${discriminator} is ready`)
					}

					return devs.debug('Create private channel for User')
				}
			}


		} else {



		}







	},
};
