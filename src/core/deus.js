const util = require('util');
const logApache = require('log4js');
const chalk = require("chalk");
/**
 * @external Spinnies
 * @type {Spinnies}
 */
const Spinnies = require('spinnies');
const isBoolean = b => typeof b === 'boolean' && b !== null;
const isObject = o => typeof o === 'object' && o !== null;
const isFunction = f => typeof f === 'function' && f !== null;
global.isEmpty = function (obj) {
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

/**
 * @class Deus
 * @description Обработка данных и логирование. Собран на основе log4js, console, spinners и chalk
 *
 */
class Deus {
    constructor() {

       const log4js = logApache

        this.color = chalk

        log4js.addLayout('json',  config => function (logEvent) {
            return JSON.stringify(toJSON(logEvent)) + config.separator;
        });
        log4js.configure(this.loggerConfigPattern);

        /**
         * Group activity
         * @type {?boolean}
         */
        this.isDebug = false;
        /**
         * Point Spinnies
         * @type {Spinnies}
         */
        const cl = chalk.hex('#00c500')
        this.point = new Spinnies({ color: cl, succeedColor: cl, spinnerColor:'yellow',succeedPrefix: '  '+String.fromCharCode(9989)+'  ' , failPrefix: '  '+ String.fromCharCode(10060)+'  '  } );
        const spinner = { interval: 180, frames: ['🍇', '🍈', '🍉', '🍋'] }
        this.spin = new Spinnies({ color: 'cyanBright', succeedColor: 'green', spinner });

        this.logConsole = log4js.getLogger("console");
        this.logDebugConsole = log4js.getLogger("tables");

        this._logErrorConsole = log4js.getLogger("tables");
        this.logDiscord = log4js.getLogger("discord");
        this.logDebug = log4js.getLogger("debug");
        this.logError = log4js.getLogger("error");
        this.logTables = log4js.getLogger("tables");
        this.logWarn =  log4js.getLogger("warn");
        this.logSave =  log4js.getLogger("save");

    }



    send(channel,...message){
        channel.send({})
    }


    /**
     * Активирует параметр Debug<br/>
     * Задает в console параметры от log4js
     *
     * @returns {Boo}
     */
    setDebug(b){
        console.debug = this.logConsole.debug.bind(this.logConsole);
        console.warn = this.logConsole.warn.bind(this.logConsole);
        console.error = this.logConsole.error.bind(this.logConsole);
        console.trace = this.logConsole.trace.bind(this.logConsole);
        return this.isDebug = true;
    }


    /**
     * @description
     * Логирование данных, используем для вывода данных по время или после выполнения тех или иных методов
     * @param {?Object} msg
     * @param {?Object} args
     * @type {function(param, param): return}
     */
    log(msg,args){
        args = args || ''

        let colorText = this.color.hex('#94fa20')
        let message = `${colorText(String.fromCharCode(9001))}${colorText('LOG  ')}${colorText(String.fromCharCode(9002))} ${colorText(msg)}`
        this.logTables.level = 'log'

        this.logTables.info(message,args)



    }
    /**
     * Информация о планируемых обработчиках
     * @param {any} msg принимает текст
     * @param {any} args принимает объект
     * @type {function(param, param): return}
     */
    info(msg,args){
        args = args || ''
        let colorText = this.color.hex('#36ffdf')
        let message = `${colorText(String.fromCharCode(9001))}${colorText('INFO ')}${colorText(String.fromCharCode(9002))} ${colorText(msg)}`
        this.logTables.level = 'log'
        this.logTables.info(message,args)


    }

    /**
     * Вывод об ошибке
     * @param {any} msg принимает текст
     * @param {object} args принимает объект
     * @type {function(param, param): return}
     */
    error(msg,args){
        args = args || ''
        let colorText = this.color.hex('#f5933e')
        let message = `${colorText(String.fromCharCode(9001))}${colorText('ERROR')}${colorText(String.fromCharCode(9002))} ${colorText(msg)}`
        this._logErrorConsole.level = 'error'
        this._logErrorConsole.error(message,args)
        this.logError.error(msg,args);

    }
    /**
     * Дебагер всего и вся
     * @param {any} msg принимает текст
     * @param {Object} args принимает объект
     * @type {function(param, param): return}
     */
    debug(msg,...args){
        args = args || ''
        let colorText = this.color.hex('#fcf012')
        let message = `${colorText(String.fromCharCode(9001))}${colorText('DEBUG')}${colorText(String.fromCharCode(9002))} ${colorText(msg)}`
        this.isDebug ? this.logDebugConsole.level = 'debug': null
        this.logDebugConsole.debug(message,args)
        this.logDebug.debug(msg,args);

    }
    /**
     * Предупреждение в логах
     * @param {any} msg принимает текст
     * @param {Object} args принимает объект
     * @type {function(param, param): return}
     */
    warn(msg,...args){
        args = args || ''
        let colorText = this.color.red
        let message = `${colorText(String.fromCharCode(10071))}${colorText(' WARNING')}${colorText(String.fromCharCode(10071)+' ')} ${colorText(msg)}`
        this.logTables.level = 'warn'
        this.logTables.warn(message,args)
    }
    /**
     * Фатальная ошибка или сбой, останавливает дальнешее логирование или выдо чего либо
     * @param {any} msg принимает текст
     * @param {Object}args принимает объект
     * @type {function(param, param): return}
     */
    fatal(msg,...args){
        args = args || ''
        let colorText = this.color.hex('#fa98fe')
        let message = `${colorText(String.fromCharCode(9940)+'  ')}${colorText('FATAL')}${colorText(' >>>')} ${colorText(msg)}`
        this.logConsole.level = 'fatal'
        this.logConsole.fatal(message,args)
    }

    /**
     * Проверка объектов и их содержимое, сделан на основе util.inspect
     * @param {...Object} objectname проверяемый объект
     * @param depth {number} глубина просмотра обьекта, по умолчанию 0
     * @param showHidden {boolean}
     * @param colors
     * @param customInspect
     * @param showProxy
     * @param maxArrayLength
     * @example
     *
     * const obj = { name: 'Tester', age:'42', location:{ place: 'NetworkCity', region: 'namespace' }}
     * devs.showObject(obj)
     * //=> [INSPECT OBJECT]{ name: 'Tester', age:'42', location: {object}}
     *
     * devs.showObject(obj,1)
     * //=> [INSPECT OBJECT] { name: 'Tester', age:'42', location:{ place: 'NetworkCity', region: 'namespace' }}
     */
    showObject(objectname,depth= 0,showHidden = false,colors = true, customInspect = true, showProxy = false, maxArrayLength = 100){

        let objectType = typeof objectname
        let colorText = this.color.hex('#2ea3a3')
        let colorTextS = this.color.hex('#fcf012')
        let inspectMSG = util.inspect(objectname, showHidden, depth , colors, customInspect, showProxy, maxArrayLength)
        if(inspectMSG === undefined) { inspectMSG = `${colorText('undefined')}`}
        let message = `${colorText(`INSPECT ${objectType.toUpperCase()} >>`)} ${colorText(inspectMSG)}`
        console.log(message)
    }
    /**
     * Трасеровка обекта
     * @param {any} msg принимает текст
     * @param {Object}args принимает объект
     * @type {function(param, param): return}
     */
    trace(msg,args){

        args = args || ''
        let colorText = this.color.hex('#fcf012')
        let message = `${colorText('[')}${colorText('TRACE')}${colorText(']')} ${colorText(msg)}`
        this.logConsole.trace(message)
    }
    /**
     * Вывод в таблице
     * @param {any} msg принимает текст
     * @param {Object}args принимает объект
     * @type {function(param, param): return}
     */
    table(msg,args){

        args = args || ''
        let colorText = this.color.hex('#fcf012')
        let message = `${colorText('[')}${colorText('TRACE')}${colorText(']')} ${colorText(msg)}`
        this.logTables.info(message)
    }

    /**
     * Конфигурация для log4js
     * @return {{object}}
     * @private
     */
    get loggerConfigPattern(){
        return {
            appenders: {
                console: {
                    type: 'stdout',

                    layout: {
                        type: 'pattern',
                        pattern: '%[[%d{hh:mm:ss SSS}]% %[ %m %]',
                    }
                },
                discord: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'message',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true

                },
                debug: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'debug',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true
                },
                selector: {
                    type: 'stdout',
                    layout: {
                        type: 'pattern',
                        //pattern: '%[ %m %] %[[%d{hh:mm:ss | yyyy-MM-dd | SSS}]%] ',
                        pattern: '%[[%d{hh:mm:ss SSS}]% %[ %m %]',

                    }
                },
                tables: {
                    type: 'stdout',
                    layout: {
                        type: 'pattern',
                        pattern: `%[ %m %]  %[${String.fromCharCode(9617)}%] %[%d{hh:mm:ss:SSS}%]`,
                    }
                },

                error: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'error',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true
                },
                warn: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'warn',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true
                },
                task: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'task',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true
                },
                save: {
                    type: 'dateFile',
                    layout: {type: 'json', separator: ','},
                    filename: pathLogs + 'mongo',
                    pattern: 'dd-MM-yyyy.json',
                    alwaysIncludePattern: true,
                    maxLogSize: 10485760,
                    backups: 3,
                    compress: true
                }
            },

            categories: {
                default: {appenders: ['discord'], level: 'info'},
                debug: {appenders: ['debug'], level: 'debug'},
                task: {appenders: ['task'], level: 'debug'},
                error: {appenders: ['error'], level: 'error'},
                selector: {appenders: ['selector'], level: 'error'},
                tables: {appenders: ['tables'], level: 'info'},
                warn: {appenders: ['warn'], level: 'warn'},
                save: {appenders: ['save'], level: 'info'},
                console: {appenders: ['console'], level: 'info', enableCallStack: true},
            },
            pm2: true,
            pm2InstanceVar: 42
        }
    }

}
module.exports = Deus