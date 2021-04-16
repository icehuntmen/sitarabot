module.exports = (global) => {
    global.ClientMemory = require("node-cache");
    global.memcache = new ClientMemory();
    global.guildLock = new ClientMemory()
    global.notifier = require('node-notifier');
    global.phook = require('perf_hooks');


    /**
     * @external Table
     * @type {{Table, printTable}}
     */
    global.tables = require('console-table-printer')
    /**
     * @external moment
     * @type {moment}
     */
    global.moment = require('moment')
    global.timezone = require('moment-timezone')

    /**
     * @global
     * @name trans
     * @description Транслейтер i18n
     * @type {{}}
     */
    global.trans = require('i18n');

    global.trans.configure({
        // setup some locales - other locales default to en silently
        locales: ['en', 'ru'],
        defaultLocale: 'ru',
        register: global,
        objectNotation: true,
        updateFiles: false,
        // where to store json files - defaults to './locales'
        directory: __dirname + '/locales'
    });
    global.trans.init();
    /**
     * @external Translator
     * @description переводчик
     * @license @danke77/google-translate-api
     * @type {Translator}
     */
    const Translator = require('@danke77/google-translate-api');
    global.transRu = new Translator({
        from: 'auto',
        to: 'ru',
        raw: false,
        client: 'gtx', // t
        tld: 'cn',
    });
    global.transEn = new Translator({
        from: 'auto',
        to: 'en',
        raw: false,
        client: 'gtx', // t
        tld: 'cn',
    });

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

}