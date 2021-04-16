const {Collection} = require('discord.js')
const cooldowns = new Collection();

/**
 * Обработчик события<br/>
 * Принимает все сообщения от бота
 * @event UBot.message
 * @param unite {UBot} бот объект с огромным функционалом
 * @param message {Message} сообщение объект {@link unite.message}
 * @return {Promise<{T}>}
 * @type {EventListener}
 */
module.exports = async (unite, message) => {


    //devs.showObject(unite,1)

    this.unite = unite

    const {channels, models, manager, users, commands} = unite
    const {guildSchema} = models
    const {ActionMessages, GuildsManager} = manager

    const {guild, author, channel} = message
    const localGuild = new GuildsManager(unite, guild, message) // Берем данные дильдии из базы


    // Определяем префиксы и приватный канал
    let botPrefix, privateCID, pcID, prefix
    let guildReady = false
    if (message.guild !== null) {
        guildReady = await localGuild.isReadyGuild // проверяем наличие гильдии в базе
        botPrefix = await guildSchema.getPrefix(guild.id)
        privateCID = await guildSchema.getPrivateChannelID(guild.id)
    }
    // Назаначаем префикс
    botPrefix ? prefix = botPrefix.prefix : prefix = config.bot.prefix
    privateCID ? pcID = privateCID.privateChannelID : pcID = config.privateChannelID;

    /** проверяем есть ли гильдия в Mongo */
    if (guildReady) {
        // Save all messages
        const saveMSG = new ActionMessages(unite);
        await saveMSG.saveMessage(message);
    }

    /** Если канал DM (приватный) то отправляем сообщение пользователю */
    channel.type === 'dm' ? channels.cache.find(dmChannel => {
        if (dmChannel.name === author.discriminator) {
            dmChannel.send(message.content)
        }
    }) : null



    /** Игнорируем сообщения от бота */
    if (author.bot) return;

    

    /**
     * Находим пользователя с дискриминатором
     * UserName # 3223
     *    ┬     ┬  ┬
     *    |     |  |
     *    |     |  └─-----  discriminator
     *    |     └─--------  tag
     *    └─--------------  Nickname or Username
     * Далее сравниваем есть ли у канала {ParentID} === {pcID} индетификатор каталога PRIVATE
     * Если есть то отправляем сообщение приватное DM для пользователя
     *
     */

    users.cache.find(user => {
        if (user.discriminator === message.channel.name) {
            if (channel.parentID === pcID) {
                user.send(message.content)
            } else {
                message.reply('ОМГ! Что то пошло не так')
            }
        }
    })

    /** Проверяем сообщение от гильдии ? если да идем джальше : закрываем */
    if (!guild) return; // exit if not guild


    const prefixMention = new RegExp(`^<@!?${unite.user.id}> `);
    const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;

    const getPrefix = new RegExp(`^<@!?${unite.user.id}>( |)$`);
    if (message.content.match(getPrefix)) return message.channel.send(`My prefix in this guild is \`${prefix}\``);
    if (message.content.indexOf(newPrefix) !== 0) return;


    // Проверяем отправляется ли сообщение от бота или сообщение без префикса - игнор
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Принимает аргументы (делим сообщение)
    // Все команды переводим в нижний регистр
    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    //unite.emit(commandName,args)
    // Проверяем есть ли альтернативные команды для бота
    // Пример: вместо команды !avatar можно набрать !icon
    const command = commands.get(commandName)
        || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    // Отсутвие команд отбой
    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    } else {

    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;


    if (timestamps.has(author.id)) {
        const expirationTime = timestamps.get(author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    let argumentCommand, permission

    if (!isEmpty(args)) {
        !isEmpty(args[1]) ? argumentCommand = args[1] : argumentCommand = null

        const commandOptions = {gm: localGuild, args:argumentCommand, message: message, unite: this.unite, ready: guildReady}
        new Promise(function (resolve, reject) {
            resolve(unite.getAccess(message))
            reject('Доступ к данной функции Вам запрещен, обратитесь к администратору')

        }).then(
            access => {
                if (access) {



                    if(!isEmpty(args[0])){
                        devs.debug('Start with argument arg[1]', args[0])
                        command[args[0]](commandOptions)
                    } else {
                        devs.debug('Start with argument - args', args)
                        command.execute(message, unite, args, guild, guildReady);
                    }

                }
            }).catch(error => devs.error(error))

    }else {
        try {
            devs.debug('Start not argument', args)
            command.execute(message, unite, args, guild, guildReady);
        } catch (error) {
            devs.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }



}
