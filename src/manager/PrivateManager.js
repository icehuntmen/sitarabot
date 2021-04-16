'use strict';

/**
 * @class
 * @memberOf UBot.manager
 */
class PrivateManager {

    async sendPrivateToBot(message,channels){
        const { channel, author} = message
        if(channel.type === 'dm') {
            let channelDM = channels.cache.find(chan => chan.name === author.discriminator)
            if (!author.bot) {

                devs.debug(`User ${author.tag} say to Bot`)
                if (channelDM === undefined) {
                    author.send(`Здравствуйте ${author.name}! О чем вы хотите поговорить? Что вас интерисует?`)
                } else {

                    if (message.content === 'delete private') {
                        //TODO пока приватные сообщения не работают на удаление
                        devs.debug(`Delete 100 private messages ${channelDM.name}`)
                    }
                    await channelDM.send(message.content);
                }
            }
        }

    }
}
module.exports = PrivateManager