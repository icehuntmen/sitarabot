'use strict';
/**
 * @memberOf UBot.manager
 * @class
 * @tutorial GuildsManager
 */
class GuildsManager {
    /**
     *
     * Класс предназначен для работы с Серверами(Гильдии) Discord, запись данных о гильдии в базу данных, настройка и проверка параметров
     * @param {UBot} unite основа {@link UBot}
     * @param {Discord.Guild} guild объект {@link Discord.Guild}
     * @param {Discord.Message} message сообщение от бота из {@link UBot.event:message}
     */
    constructor(unite,guild,message) {


        Object.defineProperty(this,/** @this unite  */ 'unite', { value: unite })
        Object.defineProperty(this, 'guild', { value: guild })
        Object.defineProperty(this, 'message', { value: message })
        Object.defineProperty(this, 'mongoose', { value: unite.mongoose })
        Object.defineProperty(this, 'guildSchema', { value: unite.models.guildSchema })

        this.isExist = this.guildSchema.isGuilsID(guild.id)

    }

    /**
     * Отправляет сообщение администратору Гильдии приватносо сообщение о чтом что гильдия заблокированна
      * @param {string} idGuild {id} идетификатор гильдии
     */
    sendMessageBanGuild(idGuild){
        let owner = this.unite.guilds.cache.get(idGuild)
        this.unite.users.cache.get(owner.ownerID).send('You guild is banned')
    }

    /**
     * Меняем префикс в базе данных по {id} для гильдии записанной в базе
     * @param {string} newPrefix новый префикс для команнд
     * @param {Object} message сообщение от бота
     * @return {Promise<void>}
     */
    async prefixUpdate(newPrefix,message){
        await this.guildSchema.updateOne({'id': this.guild.id}, {prefix: newPrefix})
            .then(result => {
                message.reply('Префикс был изменен: ' + newPrefix)
                devs.log('Update prefix guild to', {prefix: newPrefix})
            }).catch((error) => devs.error(error))
    }

    /**
     *
     * Получаем индетификатор по {this.guild.id} гильдии <br/>
     * Данный функионал предназначен для назанчения Приватной категории
     * @return {Promise<unknown>}
     * @tutorial PrivateCategory
     */
    get isParent(){
        return new Promise((resolve, reject) => {
            this.guildSchema.exists({ 'id': this.guild.id , privateChannelID: null}).then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))
        })
    }

    /**
     * Устанаваливаем гильдии приватную категорияю
     * @param {string} id  идетификатор Прикатной категории
     * @return {Promise<unknown>}
     * @this this.guildSchema
     * @tutorial PrivateCategory
     */
    set setParent(id){
        return new Promise((resolve, reject) => {
            this.guildSchema.updateOne({ 'id': this.guild.id},{privateChannelID: id}).then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))

        })
    }

    /**
     *
     * @return {Promise<unknown>}
     */
    get getGuildName(){
        return new Promise((resolve, reject) => {
            this.guildSchema.findOne({ 'id': this.guild.id} , 'name').then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))

        })
    };

    /**
     * Запрос по Индетификатору гильдии в базе Бота
     * @returns {Promise<getGuild>} получаем из базы данные по {guild.id}
     * @example
     *
     * const guild = new GuildsManager(unite,guild,message).getGuild
     * // => {object Guild}
     * @type {Object}
     */
    get getGuild(){
        return new Promise((resolve, reject) => {
            this.guildSchema.findOne({ 'id': this.guild.id}).then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))
        })
    };
    /**
     * Проверяем данный в базе Бота,
     * установлен ли параметр  active
     * @this this.guildSchema
     * @return {Promise<unknown>} Boolean
     */
    get isActive(){
        return new Promise((resolve, reject) => {
            this.guildSchema.exists({'id': this.guild.id, 'active': true}).then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))

        })
    }

    get isBanned(){
        return new Promise((resolve, reject) => {
            this.guildSchema.exists({'id': this.guild.id, 'banGuild': true}).then(result => {
                resolve(result);
            }).catch(reason => devs.showObject(reason))
            return reject
        })
    }

    /**
     * Проверяем активна ли гильдия
     * @this this.guildSchema
     * @returns {Promise<Boolean>}
     */
    get isReadyGuild(){
        return new Promise((resolve, reject) => {
            this.guildSchema.exists({ 'id': this.guild.id }).then(result => {
                resolve(result);

            }).catch(reason => devs.showObject(reason))

        })
    }


    /**
     * Метод сохранения данных на основе {unite,Guild,Messages}
     * @this this.guild
     * @this this.isExist
     * @return {Promise<*>}  сохраняем данные в базу
     */
    async saveGuildToBase(){

        if (await this.isBanned) return devs.debug(`Server is banned "${this.guild.name}"(${this.guild.id})`)
        if (!await this.isExist) {
            let defaults = Object.assign({ _id: this.mongoose.Types.ObjectId() }, config.bot);
            let merged = Object.assign(defaults, this.guild);
            const createdGuild = await new this.guildSchema(merged,{ autoIndex: false });
            createdGuild.save().then(action => {
                        this.message.reply('Ваш сервер добавлен в систему. Если вы хотите выполнить доподнительные настройки набаерите команду !setup help')
                        devs.point.succeed('setupinit', { text: `Server ${merged.name} with ${merged.id} saved into DB` });
                        return devs.debug(`Default settings saved for guild "${merged.name}" (${merged.id})`,[action.id])
                    }
              ).catch((e)=> devs.error(e));

        } else {
            //let channel = this.guild.channels.cache.get(this.guild.ownerID);
            devs.point.fail('setupinit', { text: `Warrning! Server ${this.guild.name} with ${this.guild.id} is active into DB.` });
            this.message.reply('Ваш сервер присутвует в системе управления. Если вы хотите выполнить доподнительные настройки набаерите команду !setup help')
            //return this.guild.channels
        }
    }
    async test(){

        if(!this.guild) return
        let tizo  = timezone.tz.guess()
        return {
            timezone: tizo, time: timezone.tz(tizo).format(), guild: this.guild.name, channel: this.message.channel.name, user: this.message.author.tag , content: this.message.content
        }
    }

    /**
     * Удаление сервера из базы по событию unite.on:guildDelete
     * @return {Promise<void>}
     */
    async onDeleteGuild(){
        await this.guildSchema.deleteOne({'id': this.guild.id})
            .then(result => {
                devs.showObject(result)
                devs.log('Success! Delete data from unite.on:guildDelete',)
            }).catch((error) => devs.error(error))
    }

    /**
     *
     * @param {String} id
     * @return {Promise<void>}
     */
    async deleteGuild(id){

        await this.guildSchema.deleteOne({'id': id})
            .then(result => {
                devs.showObject(result)
                devs.log('Delete data from !setup delete',)
            }).catch((error) => devs.error(error))

    }

    async onGuildUpdate(oldGuild,newGuild){

        let newObjectGuild = {};
        for (const [key, value] of Object.entries(oldGuild)) {
            if(oldGuild[key] !== newGuild[key])
            {
                newObjectGuild[key] = newGuild[key]
                devs.debug(key,value)
            }
        }
        let updateTime = { lastUpdateTimestamp: moment().format() }
        let mergeData = Object.assign(newObjectGuild, updateTime)

        await this.guildSchema.updateOne({'id': this.guild.id}, mergeData)
            .then(result => {
                devs.showObject(result)
                devs.log('Update guild data from unite.on:guildUpdate', mergeData )
            }).catch((error) => devs.error(error))


    };
    async guildUpdateLocal(){

        let updateTime = { lastUpdateTimestamp: moment().format() }
        let mergeData = Object.assign(this.guild, updateTime)

        await this.guildSchema.updateOne({'id': this.guild.id}, mergeData)
            .then(result => {
                devs.showObject(result)
                devs.log('Update guild data from !setup update', mergeData )
            }).catch((error) => devs.error(error))


    };

}

module.exports = GuildsManager