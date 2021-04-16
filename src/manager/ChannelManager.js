'use strict';

/**
 * Создание и управление каналами
 *
 * @class
 * @memberOf UBot.manager
 */
class ChannelManager{
    /**
     *
     * @type {string}
     */
    DEFAULT_MESSAGE = ''

    /**
     *
     * @param {UBot} unite
     * @param {Channel} channel
     * @param {Message} message
     */
    constructor(unite, channel,message) {

        Object.defineProperty(this, 'unite',{value: unite})
        Object.defineProperty(this, 'channel',{value: channel})
        Object.defineProperty(this, 'channelSchema',{value: unite.models.channelSchema})
        Object.defineProperty(this, 'mongoose',{value: unite.mongoose})

    }

    /**
     * Сохраняем информацию канала
     * @method
     * @param {string} channelID
     * @param {string} messageID
     * @return {Promise}
     */
    async saveChannel(channelID, messageID) {
        const channel = this.unite.channels.cache.get(channelID)
        const messageSend = this.unite.channels.cache.get(messageID)
            if (!await this.isExist(channelID)) {
                const roles = Object.fromEntries(channel.permissionOverwrites)
                const guildID = channel.guild.id

                const dataChannel = {_id: this.mongoose.Types.ObjectId(), guildID: guildID, roles: roles}
                const mergeData = Object.assign(dataChannel, channel)

                const newChannel = await new this.channelSchema(mergeData, {autoIndex: false});
                newChannel.save().then(action => {
                    // devs.debug(`Default settings saved for guild ${dataChannel.name}`)
                    messageSend.send(`Канал <#${channel.id}> теперь приоритетный!`)
                });
            } else {
                devs.debug(`Данные о канале ${channelID} уже существуют в базе!`)
                messageSend.send(`Канал <#${channel.id}> уже установлен по-умолчанию!`)
                if (await this.isActive(channelID)) {
                    messageSend.send('Для того чтобы сделать активным канал для бота введите команду \`!help channel\`')
                    return
                }
            }


            // devs.showObject(await this.isExist(channelID), 1)

    }

    /**
     *
     * @param dataUpdate
     * @return {Promise<{}>}
     */
    async updateChannel(dataUpdate) {
        let ok = {}
        await this.channelSchema.updateOne({'id': this.channel.id}, dataUpdate).then(channelUp => ok =channelUp )
        return ok
    }

    /**
     *
     * @param mention
     * @return {{descr: string, status: boolean}|{descr: string, channel: Holds, status: boolean}}
     */
    getChannelFromMention(mention) {
        if (mention == null) return { status: false , descr: 'Нет входящих данных'}

        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<#!?(\d+)>$/);

        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return { status: false , descr: 'Не найдено значение в аргументе'};

        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        return { status: true, channel: this.unite.channels.cache.get(id),descr: 'Найден канал'}
    }

    /**
     *
     * @param roleName
     * @param message
     * @return {Promise<void>}
     */
    async setRoleForChannel(roleName, message){
        message.guild.roles.create({ data: { name: `${roleName}`, permissions: ['MANAGE_MESSAGES', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] } })
            .then(async () => {
                const newRole = message.guild.roles.cache.find(role => role.name === roleName)
                await this.channelSchema.saveMainRole(newRole.id, message.channel.id)
                await message.channel.updateOverwrite(newRole, { VIEW_CHANNEL: true, ADD_REACTIONS: false })
            }).catch(e => {
            message.channel.send('Добавление роли невозможно!')
        })
        message.channel.send(`Роль ${roleName} была успешно добавлена и установлена как основная`)
    }

    /**
     *
     * @param  {string} channelID
     * @return {Promise<any>}
     */
    async isExist(channelID){
        return await this.channelSchema.exists({'id': channelID})
    }

    /**
     *
     * @param {string} channelID
     * @return {Promise<any>}
     */
    async isActive(channelID){
        return await this.channelSchema.exists({'id': channelID, 'active': true})
    }

    /**
     * Получаем идентификатор
     * @return {string}
     */
    get getChannelID(){
        return this.channel.id;
    }

    /**
     *
     * @param idChannel
     * @return {Promise<*>}
     */
    async getChannel(idChannel){
        return  await this.channelSchema.findOne({'id': idChannel}).exec()
    }

}

module.exports = ChannelManager