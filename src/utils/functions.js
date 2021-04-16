const fs = require('fs')
const {performance, PerformanceObserver} = require('perf_hooks');
const util = require('util');
const { Collection } = require('discord.js')
const {version} = require('../../package.json')


/**
 * Клиентские функции
 * @function uFunctions
 * @param {Client} unite
 */
module.exports = (unite) => {



    /**
     * @function
     * @param text {string}
     * @return {string|*}
     */
    unite.clean = text => {
        if (typeof(text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return text;
        }
    };

    /**
     * @function
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, channel: Holds, status: boolean}}
     */


    /**
     * @method
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, member: *, status: boolean}}
     */

    /**
     * @method
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, role: Role, status: boolean}}
     */


    /**
     * @method
     * @param embedName
     * @return {V|*}
     */
    unite.getEmbed = (embedName) => {

        return new Proxy(unite.embeds.get(embedName),{
            get(target,prop){
                 return target[prop]
            }
        })

    };
    /**
     * @name setup.setEmbeds
     * @description Динамический закргузчик  из {@link discordbot.embeds}
     * Собирает все файлы в папке ./embeds. Название файла - это название оформления для сообщения.
     * @see discorbot.setup
     * @return {Promise<void>}
     * @type {Collection<name, function>}
     */

    unite.setup.
    /**
     * @name setup.setCommand
     * @description Динамический закргузчик  из {@link discordbot.commands}
     * Собирает все файлы в папке ./commands. Название файла - это название команды.
     * @see unite.setup
     * @return {Promise<void>}
     * @type {Collection<name, function>}
     */



    /**
     * @name discorbot.setEvents
     * @description Динамический погрузчик {@link Events} в {@link unite}
     * Собирает все файлы в папке ./events. Название файла - это название эвента.
     * @see discorbot.setup
     * @return {Promise<void>}
     * @example
     *
     * guildCreate.js === unite.on('guildCreate',guild)
     */

    unite.getAccess = (message) =>{

        try{
            const userPermissions = message.guild.members.cache.get(message.author.id).hasPermission(this.permissions);
            if(!userPermissions) { message.channel.send('Доступ к данной функции Вам запрешен, обратитесь к администратору')}
            return userPermissions
        }catch (e) {
            devs.warn(e)
        }
    };
    unite.getRandomKey = (collection) =>{

        let keys = Array.from(collection.keys());
        keys.forEach(element => {
            if(unite.users.cache.get(element).bot){
                collection.delete(element)
            }
            // console.dir(unite.users.cache.get(element),{showHidden: false, depth: 0, colors: true})
        })
        let keys2 = Array.from(collection.keys());
        return keys2[Math.floor(Math.random() * keys2.length)];
    };

    global.toJSON = proto => {
        let jsoned = {};
        let toConvert = proto || this;
        Object.getOwnPropertyNames(toConvert).forEach((prop) => {
            const val = toConvert[prop];
            // don't include those
            if (prop === 'toJSON' || prop === 'constructor') {
                return;
            }
            if (typeof val === 'function') {
                jsoned[prop] = val.bind(jsoned);
                return;
            }
            jsoned[prop] = val;
        });

        const inherited = Object.getPrototypeOf(toConvert);
        if (inherited !== null) {
            Object.keys(toJSON(inherited)).forEach(key => {
                if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
                    return;
                if (typeof inherited[key] === 'function') {
                    jsoned[key] = inherited[key].bind(jsoned);
                    return;
                }
                jsoned[key] = inherited[key];
            });
        }
        return jsoned;
    }

    unite.setup.show = ()=> {


        const p = new tables.Table({
            columns: [
                { name: 'index', alignment: 'left', color: 'blue' }, //with alignment and color
                { name: 'name', alignment: 'right' },
                { name: 'descr', alignment: 'left' },
            ],
        });

        let mongoStatus = unite.mongoose.infoStatus[unite.mongoose.connection.readyState]

        p.addRow({ index: 1, name: 'DataBase' , status: unite.mongoose.connection.readyState , descr: mongoStatus }, { color: 'green' });
        p.addRow({ index: 2, name: 'Commands', status: unite.commands.size ,descr: `Config Prefix [ ${config.bot.prefix} ]` });
        p.addRow({ index: 3, name: 'uniteEvents', status: unite.setup._events.size , descr: 'EventsHandler amount'},{ color: 'yellow' });
        p.addRow(
            { index: 4, name: 'Version app', status: version, descr: unite.user.tag+ ' ' },
            { color: 'yellow' }
        );

        p.addRow(
            { index: 5, name: 'Servers[Guilds]', status: unite.guilds.cache.size,descr: 'Количество гильдий' },
            { color: 'cyan' }
        );
        p.addRow({ index: 6, name: 'Channels', status: unite.channels.cache.size,descr: 'Количество каналов' },{ color: 'cyan' });
        p.addRow({ index: 7, name: 'Users', status: unite.users.cache.size,descr: 'Количество пользователей' },{ color: 'cyan' });
        p.printTable()


    }

};