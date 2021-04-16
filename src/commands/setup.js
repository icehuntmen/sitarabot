/**
 * Модуль для работы с Гильдией(Сервер) дискорда.<br/>
 * Выполняет команды на основе CRUD<br/>
 * Все данные и выборочные параметры обрабатываются в разными методами.
 * @name setup
 * @module commands.setup
 */
//const commandOptions = {gm: localGuild, args:argumentCommand, message: message, unite: this.unite, ready: guildReady}
module.exports = {
	name: 'setup',
	description: 'Устанавка и активация сервера для последующего управления и выполнения ряда команд',
	install: '# Инструкция\n' +
		'1. [ !setup start ](command) - запустите команаду !setup с аргументом start\n' +
		'2. [ !setup prefix (!|?|-) ](command) - укажите префикс для вашего сервера',
	system: true,
	permissions: ['ADMINISTRATOR'],
	aliases: ['server','guild'],
	guildOnly: true,
	cooldown: 5,

	async execute(message, unite, args, guild) {


	},
	/**
	 * Проверка данных о гильдии и вывод данных объектом
	 *
	 * @param options {GuildsManager} принимает параметры
	 * @returns {Promise<void>} возвращает промис
	 * @description в дискорде выполнить команду !setup init
	 * @example
	 *
	 * command[args](options)
	 * //=> выполняет команду по аргументу, аргумент является
	 */
	async info(options){
		return devs.showObject({gm: options.gm, args: options.args,msg: options.message, unite: options.unite })
	},
	/**
	 * Набираем команду:
	 * !setup init
	 *
	 * Записываем все данные приходящие unite
	 * @param options {GuildsManager} принимает параметры
	 * @returns {Promise<void>} возвращает промис
	 * @description в дискорде выполнить команду !setup init
	 * @example
	 *
	 * command[args](options)
	 * //=> выполняет команду по аргументу, аргумент является
	 */
	async init(options){
		devs.point.add('setupinit', { text: 'Run command : Setup init' });
		await options.gm.saveGuildToBase()
	},
	async prefix(options){
		devs.showObject(options)
		if(options.args){
			await options.gm.prefixUpdate(options.args,options.message);
		} else{
			options.message.reply('' +
				'[Ошибка](Вы не указали префикс)\n' +
				'Пример: !setup prefix !!\n',{code: 'markdown'})
		}
	},
	async update(options){
		await options.gm.guildUpdateLocal()
	},
	async delete(options){

		const filter = (reaction, user) => {

			return ['👍', '👎'].includes(reaction.emoji.name)  && user.id === options.message.author.id;
		};

		const sendBot = await options.message.channel.send(`Вы дествительно хотите удалить ${options.message.guild.name}`).then(msg => {
			msg.react('👍');
			msg.react('👎');
			return msg
		})
		sendBot.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {

				const reaction = collected.first();
				if (reaction.emoji.name === '👍') {
					options.gm.deleteGuild(options.message.guild.id)
					options.message.reply('you reacted with a thumbs up.');
				} else {
					options.message.reply('you reacted with a thumbs down.');
				}
			})
			.catch(collected => {
				options.message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
			});

	},
	async status(options){
		const guildBase = await options.gm.getGuild
				.then(result => {
					if(result !== null){
						const guild = options.unite.guilds.cache.get(guildBase.id)
						const embedServer = options.unite.getEmbed('statusEmbed').drawEmbed(guild,guildBase)
						options.message.channel.send({embed:embedServer})
					}
				})
				.catch((e) => devs.error(e))
	},
	async link(options){
		options.unite.generateInvite(['ADMINISTRATOR'])
			.then(link => {
				console.log(`Generated bot invite link: ${link}`);
				inviteLink = link;
			});
	},
	IndexedArray(){ return new Proxy(Array, {
		construct(target, [args]) {
			const index = {}
			args.forEach(item => (index[item.id] = item))

			return new Proxy(new target(...args), {
				get(arr, prop) {
					switch (prop) {
						case 'push':
							return item => {
								index[item.id] = item
								arr[prop].call(arr, item)
							}
						case 'findById':
							return id => index[id]
						default:
							return arr[prop]
					}
				}
			})
		}
	})
	},
	_switchHandler(target, prefix = '_') {
		return new Proxy(target, {
			has: (obj, prop) => prop in obj && !prop.startsWith(prefix),
			ownKeys: obj => Reflect.ownKeys(obj).filter(p => !p.startsWith(prefix)),
			get: (obj, prop, receiver) => prop in receiver ? obj[prop] : void 0

		})
	},



};
