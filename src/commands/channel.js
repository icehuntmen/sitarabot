/**
 * @name channel
 * @module commands.channel
 * @tutorial channelCommand
 * @type {Object}
 */
module.exports = {
    name: 'channel',
    description: 'Set channel for lfg',
    type: 'system',
    /**
     *
     * @param message {Message}
     * @param unite {UBot}
     * @param args {?Object}
     * @param guild {Guild}
     * @param guildReady {Boolean}
     * @return {Promise<*>}
     */
    async execute(message, unite, args, guild, guildReady) {
        devs.debug('Наличие гильдии в базе', guildReady)
        if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')
        const userPermissions = guild.me.permissions;
        if(!userPermissions.has('ADMINISTRATOR')) return message.channel.send('Доступ к данной функции Вам запрешен, обратитесь к администратору')

        const newChannel =  await new unite.unitebot.ChannelManager(unite);
        const channelModel = unite.models.channelSchema;
        //args = message.content.replace(/\D/g,'')

        let channelID = ''
        /**
         * Фильтр аргументов
         * 1-й if проверяет наличие аргументов, если аргументы отстутствуют, то канал записывается по комманде !channel
         *
         */
        if (!Boolean(args.length)) {

            // Проверяем есть ли канал в базе
            if(await newChannel.isExist(message.channel.id)){
                return message.channel.send(`Канал <#${message.channel.id}> уже назначен в системе событий`)
            }

            // Проверяем активный ли канал, если не активный,
            // Пишем оператору - Введите !channel active или с указанием канала в виде 2 аргумента


            if (message.channel.type === 'text'){
                channelID = message.channel.id
                await newChannel.saveChannel(message.channel.id, message.channel.id)
                devs.debug('Сохраняем в базу канал ' + channelID)
            }

        } else {
            const checkIDArgs1 = newChannel.getChannelFromMention(args[0])
            const checkIDArgs2 = newChannel.getChannelFromMention(args[1])

            checkIDArgs1.status ? channelID = checkIDArgs1.channel.id : channelID = message.channel.id

            if (!checkIDArgs1.status){

                checkIDArgs2.status ? channelID = checkIDArgs2.channel.id : channelID = message.channel.id

                switch(args[0]) {
                    case 'active':
                        devs.showObject(channelModel,0)

                        await channelModel.activeChannel(channelID)
                        devs.log('Активация канала с ID:'+ channelID)
                        break;
                    case 'delete':
                        await channelModel.deactiveChannel(channelID)
                        break;
                    case 'update':
                        break;
                    case 'listrole':
                        break;
                    case 'create':
                        break;
                    case 'addrole':
                        const filter = m => m.content
                        devs.showObject(args[1])
                        message.channel.send('Введите название роли:')
                            .then(() => message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 30000,
                                errors: ['time'],
                            })
                                .then(collected => {
                                    const roleName = collected.first().toString()
                                    if (message.guild.roles.cache.find(r => r.name === roleName)) {
                                        message.channel.send('Вы ввели название уже существующей роли')
                                        return
                                    }
                                    else{
                                        newChannel.setRoleForChannel(roleName, message)
                                    }
                                }).catch(e => {
                                    message.channel.send('Время для ввода названия роли закончилось! Попробуйте снова');
                                }))
                        break;
                    case 'endrules':
                        break;
                    case 'stoprules':
                        break;
                    default:
                        devs.warn('Первый аргумент - не правильная команда: ' + args[0])
                        break
                }
            } else {

                await newChannel.saveChannel(channelID, message.channel.id)
                devs.debug('Сохраняем в базу канал ' + channelID + ' из аргумента')
            }
        }


        //const channel = channelSave.getChannelFromMention(args[0])

        //devs.showObject(matches, 0)
        //message.channel.send(`${JSON.stringify(matches,null,4)}`, { code: 'js' })
    }

}