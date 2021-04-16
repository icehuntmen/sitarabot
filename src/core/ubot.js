const {Client, Collection} = require('discord.js')
const phook = require('perf_hooks');
const fs = require('fs')

const {version} = require('../../package.json')
const { performance} = phook;

/**
 * @class
 * @extends {Client}
 */
class UBot extends Client{

    constructor() {
        super();
        /**
         * Настройки
         * @type {{}}
         * @private
         */
        this.setup = {}

        /**
         * Mongoose for MongoDB
         * @see https://mongoosejs.com/docs/guide.html
         * @type {Mongoose}
         */
        this.mongoose = require('mongoose');

        /**
         * Список команд
         * @type {Collection<command, function>}
         */
        this.commands = new Collection();
        /**
         * Список оформлений
         * @type {Collection<embed, Object>}
         */
        this.embeds = new Collection();
        /**
         * Список моделей
         * @type {Mongoose.Schema}
         */
        this.models = require('../models');

        /**
         *
         * @type {Job.<name, job, callback>}
         */
        this.tasks = require('node-schedule');

        /**
         * Набор управляющих классов
         * @type {Object[]}
         */
        this.manager = require('../manager');

        /**
         * Управление событиями
         * @type {{publicEvent: {}, gamesEvent: {}}}
         */
        this.lfg = require('../lfg');
        /**
         *
         * @type {{init: function(): void}}
         */
        this.systems = require('../utils/process');



    }

    /**
     * Загрузка событий, комманд и оформления
     * @param dir {string}
     * @return {Promise.<boolean>}
     */
    init(dir){
        return new Promise((resolve => {
            devs.point.add('eventList', { text: 'Client bind onEvents list' });
            this.listEvents(dir)
            resolve(dir);
        })).then(result => {
            devs.point.add('commandList', { text: 'Client bind Command list' });
            this.listCommand(result)
            return dir
        }).then(result => {
            devs.point.add('embedList', { text: 'Client bind Embeds list' });
            this.listEmbeds(result)
            return true
        }).catch((e) => new Error(e))
    }

    /**
     * @description
     * Соединение с базой
     * @return {Mongoose.connection.<connected|err|disconnected>} status состояние соединения
     */
    startMongo(){

        this.mongoose.connect(config.mongoUrl, config.dbOptions);
        //this.mongoose.Promise = global.Promise;
        this.mongoose.infoStatus = ['Mongoose disconnected','Mongoose ready! MongoDB ready!'];

        this.mongoose.connection.on('connected', () => {
            devs.point.succeed('connectMongo', { text: 'MongoDB status connected!' });
        });

        this.mongoose.connection.on('err', err => {
            devs.point.fail('connectMongo', { text: 'Connection mongoDB:'+ err });
        });

        this.mongoose.connection.on('disconnected', () => {
            devs.point.fail('connectMongo', { text: 'Not connection mongoDB:'});
        });

    }

    /**
     *
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, channel: Channel, status: boolean}}
     */
    getChannelFromMention(mention,guild){
        if (mention == null) return { status: false , descr: 'Нет входящих данных'}
        const matches = mention.match(/^<#!?(\d+)>$/);
        if (!matches) return { status: false , descr: 'Не найдено значение в аргументе'};
        const id = matches[1];
        return { status: true, channel: this.channels.cache.get(id),descr: 'Найден канал'}
    }

    /**
     *
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, member: *, status: boolean}}
     */
    getUserFromMention(mention,guild){
        if (mention == null) return { status: false , descr: 'Нет входящих данных'}
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return { status: false , descr: 'Не найдено значение в аргументе'};
        const id = matches[1];
        return { status: true, member: guild.members.cache.get(id),descr: 'Найден пользователь'}
    }

    /**
     *
     * @param mention
     * @param guild
     * @return {{descr: string, status: boolean}|{descr: string, role: Role, status: boolean}}
     */
    getUserRoleMention(mention,guild){
        if (mention == null) return { status: false , descr: 'Нет входящих данных'}
        const matches = mention.match(/^<@&?(\d+)>$/);
        if (!matches) return { status: false , descr: 'Не найдено значение в аргументе'};
        const id = matches[1];
        return { status: true, role: this.roles.cache.get(id),descr: 'Найден пользователь'}
    }

    /**
     *
     * @param embedName
     * @return {*}
     */
    getEmbed(embedName){

        return new Proxy(this.embeds.get(embedName),{
            get(target,prop){
                return target[prop]
            }
        })

    }

    /**
     *
     * @return {Promise<Object>}
     */
    async listEmbeds(dir){

        try{
            const embedsFiles = await fs.readdirSync(`${dir}/src/embeds`).filter(file => file.endsWith('.js'));

            for (const file of embedsFiles) {
                const embed = require(`${dir}/src/embeds/${file}`);
                performance.mark(embed.name)
                this.embeds.set(embed.name, embed);
            }
            devs.point.update('embedList', { text: 'Unitebot bind Embeds list' });
            //devs.point.remove('embedList')
        } catch (e) {
            devs.point.fail('embedList', { text: 'Unitebot not bind Embeds list. '+ e +'\n' });

        }
    };

    /**
     *
     * @return {Promise<Collection>}
     */
    async listCommand(dir){

        // Собираем все команды
        try{
            const commandFiles = await fs.readdirSync(`${dir}/src/commands`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`${dir}/src/commands/${file}`);
               this.commands.set(command.name, command);
            }
            devs.point.update('commandList', { text: 'Unitebot bind Commands list' });
            //devs.point.remove('commandList')
        } catch (e) {
            devs.point.fail('commandList', { text: 'Unitebot not bind Commands list. '+ e +'\n' });

        }
    };

    /**
     *
     * @return {Promise<Events>}
     */
    async listEvents(dir){

        const listEventsCollection = new Collection();
        try{
            const eventsFiles = await fs.readdirSync(`${dir}/src/events`).filter(file => file.endsWith('.js'));
            for (const file of eventsFiles) {
                const event = require(`${dir}/src/events/${file}`);
                let eventName = file.split('.')[0];
                listEventsCollection.set(eventName, event)
                this.on(eventName, event.bind(null, this));
            }
            this.setup._events = listEventsCollection; //  Map all events
            devs.point.update('eventList', { text: 'Unitebot bind onEvents list' });
        } catch (e) {
            devs.point.fail('eventList', { text: 'Unitebot not bind onEvents list. '+ e +'\n' });
        }

    };

    /**
     *
     * @param {Message} message
     * @return {*}
     */
    getAccess(message){

        try{
            const userPermissions = message.guild.members.cache.get(message.author.id).hasPermission(this.permissions);
            if(!userPermissions) { message.channel.send('Доступ к данной функции Вам запрешен, обратитесь к администратору')}
            return userPermissions
        }catch (e) {
            devs.warn(e)
        }
    };

    /**
     * @return {Tables}
     */
    showStatus(){


        const p = new tables.Table({
            columns: [
                { name: 'index', alignment: 'left', color: 'blue' }, //with alignment and color
                { name: 'name', alignment: 'right' },
                { name: 'descr', alignment: 'left' },
            ],
        });

        let mongoStatus = this.mongoose.infoStatus[this.mongoose.connection.readyState]

        p.addRow({ index: 1, name: 'DataBase' , status: this.mongoose.connection.readyState , descr: mongoStatus }, { color: 'green' });
        p.addRow({ index: 2, name: 'Commands', status: this.commands.size ,descr: `Config Prefix [ ${config.bot.prefix} ]` });
        p.addRow({ index: 3, name: 'uniteEvents', status: this.setup._events.size , descr: 'EventsHandler amount'},{ color: 'yellow' });
        p.addRow(
            { index: 4, name: 'Version app', status: version, descr: this.user.tag+ ' ' },
            { color: 'yellow' }
        );

        p.addRow(
            { index: 5, name: 'Servers[Guilds]', status: this.guilds.cache.size,descr: 'Количество гильдий' },
            { color: 'cyan' }
        );
        p.addRow({ index: 6, name: 'Channels', status: this.channels.cache.size,descr: 'Количество каналов' },{ color: 'cyan' });
        p.addRow({ index: 7, name: 'Users', status: this.users.cache.size,descr: 'Количество пользователей' },{ color: 'cyan' });
        p.printTable()


    }

    addListener(event, listener) {
        return undefined;
    }

    eventNames() {
        return undefined;
    }

    getMaxListeners() {
        return 0;
    }

    hasOwnProperty(v) {
        return false;
    }

    isPrototypeOf(v) {
        return false;
    }

    listenerCount(type) {
        return 0;
    }

    listeners(event) {
        return [];
    }

    prependListener(event, listener) {
        return undefined;
    }

    prependOnceListener(event, listener) {
        return undefined;
    }

    propertyIsEnumerable(v) {
        return false;
    }

    rawListeners(event) {
        return [];
    }

    removeListener(event, listener) {
        return undefined;
    }

    setMaxListeners(n) {
        return undefined;
    }

    toLocaleString() {
        return "";
    }

    toString() {
        return "";
    }

    valueOf() {
        return undefined;
    }
}
module.exports = UBot
