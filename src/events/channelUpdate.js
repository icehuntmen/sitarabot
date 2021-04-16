module.exports = async (unite, oldChannel, newChannel) => {


    devs.info('channelUpdate events!')
    //unite.logger.inspect(oldChannel,0)
    //unite.logger.info('channelUpdate  newchannel data events!')
    //unite.logger.inspect(newChannel,0)
    /**
     * Обновление базы данных после любого изменения канала на сервере
     */
    const {ChannelManager} = unite.unitebot
    const cm  = new ChannelManager(unite, newChannel)
    if (await cm.isExist(newChannel.id)) {
        devs.debug('Начинаем процедуру сохранения!')
        let newObject = {}
        for (const [key, value] of Object.entries(oldChannel)) {
            if(oldChannel[key] !== newChannel[key])
            {
                newObject[key] = newChannel[key]
                devs.showObject(typeof value)
            }
        }
        await cm.updateChannel(newObject).then(channelNew => devs.showObject(channelNew) )
    }

    //devs.showObject(newObject)

};