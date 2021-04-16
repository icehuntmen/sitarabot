 /**
 * Обработчик события в {unite}
 * Создание нового канала
 * @event unite.channelCreate
 * @param unite {Client}
 * @param channel {Object}
 * @return {Promise<*>}
 * @type {Event}
 */
module.exports = async (unite, channel) => {

    devs.info('channelCreate events!')
    const guild = unite.guilds.cache.find(guild => guild.id === config.guildID)

    if(channel.type === 'dm'){

        devs.showObject(channel,1)
        const nameChannel = channel.recipient
        const isChannel = guild.channels.cache.some(channel => channel.name === nameChannel.discriminator)

        if(!isChannel){
           await channel.recipient.send('Здравствуйте! У вас есть какието вопросы ко мне?')
           await guild.channels.create(nameChannel.discriminator, {parent:'748806273205796935' , topic: `Приватный канал ${nameChannel.tag}` })
                .then(logger => devs.debug(logger))
                    .catch(error => devs.error(error));
        } else {
            devs.debug(`Channel ${nameChannel.discriminator} is ready`)
        }

    } else {
        return;
    }


};