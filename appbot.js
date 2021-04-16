/**
 * LFG Discord bot<br/>
 * Created team「CODΞ」DΞVS
 * @file unitebot.js
 * @copyright:  Shumilin Roman <colddevelop@gmail.com>,  Alexander Hunter <icehuntmen@gmail.com>
 */
const Bot = require('./src/core/ubot')

const { DiscordInteractions } = require("slash-commands");
require('dotenv-flow');
require('./src/core/globals')(global)
global.pathLogs = __dirname + '/logs/'
global.pathImages = __dirname + '/src/images/'

const { performance, PerformanceObserver} = phook;
/**
 * Конфигурация всего проекта
 * @external Config
 * @type {Config}
 */
global.config = require('config');
/**
 * @global
 * @name devs
 * @description Система логирования данных , вывод в консоль и запись в файлы
 * можно использовать в глобальном пространстве
 * @type {Deus}
 * @example
 *
 * devs.log('Hello World') //=> [LOG] Hello World | 13:30:51:346
 * devs.debug('Объект сообщения',message) //=> [DEBUG] Объект сообщения, {id:..., content: 'Hello World',...} | 13:30:51:346
 */
const Deus = require('./src/core/deus');
global.devs = new Deus()

// автивируем дебагер
devs.setDebug(true)


const unite = new Bot({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    shards: "auto",
    disableEveryone:  true,
    messageCacheMaxSize: 500,
    messageCacheLifetime: 120,
    messageSweepInterval: 60
});

const interaction = new DiscordInteractions({
    applicationId: process.env.APP_ID,
    authToken: process.env.DISCORD_TOKEN,
    publicKey: process.env.CLIENT_PUBLIC_KEY
});

(async function (){
    await interaction
        .getApplicationCommands()
        .then(console.log)
        .catch(console.error);
    devs.showObject(interaction)
})(interaction);

// Start UNITBOT
 try  {
     devs.point.add('connectMongo', { text: 'Connection mongoDB...' });
     devs.point.add('readyBot', { text: 'Unitebot is loaded...' });
     unite.startMongo();
     unite.init(__dirname);
     unite.systems.init();
} catch (e) {
    devs.warn('Server Error', e.message)
    process.exit(1)
}
/**
 * @name Ubot.login
 * @description Ключ бота
 * @type {UBot.token}
 */
unite.login(process.env.DISCORD_TOKEN);



/**
 * Object with values passed from server to template and is available directly in the source of logged in user's dashboard generated in frontend/express/views/dashboard.html template
 * @name Discord
 * @global
 * @namespace Discord
 */


/**
 * @name Discord.Collection
 * @memberOf Discord
 * @class Collection
 * @see {@link https://discord.js.org/#/docs/collection/master/class/Collection}
 */

/**
 * @name Discord.Message
 * @memberOf Discord
 * @class Message
 * @description new Discord.Message(client,data,channel);
 * @see {@link https://discord.js.org/#/docs/main/master/class/Message}
 * @param {Client} client
 * @param {Object} data
 * @param {Channel} channel
 * @property author {external:User}
 * @property channel {external:Channel}
 * @property guild {external:Guild}
 */

/**
 * @name Discord.Guild
 * @memberOf Discord
 * @class Guild
 * @see {@link https://discord.js.org/#/docs/main/master/class/Guild}
 */

/**
 * @name Discord.User
 * @memberOf Discord
 * @class User
 * @see {@link https://discord.js.org/#/docs/main/master/class/User}
 */


/**
 * @name Discord.Channel
 * @memberOf Discord
 * @class Channel
 * @see {@link https://discord.js.org/#/docs/main/master/class/Channel}
 */


 /**
 * @name Discord.Client
 * @memberOf Discord
 * @class Client
 * @see {@link https://discord.js.org/#/docs/main/master/class/Client}
 * @param {ClientOptions} [options] Options for the client
 */

/**
* @external Mongoose
* @see https://mongoosejs.com/docs/guide.html
*/

