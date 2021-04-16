const fs = require('fs')
const util = require('util');
const { Collection } = require('discord.js')
const {version} = require('../../package.json')
module.exports = unite => {



    unite.logger = util.deprecate(function() {
        for (let i = 0, len = arguments.length; i < len; ++i) {
            process.stdout.write(arguments[i] + '\n');
        }
    }, 'unite.logger: Use devs.log | devs.info | devs.showObject instead');

    unite.logger.log  = util.deprecate(function() {
        for (let i = 0, len = arguments.length; i < len; ++i) {
            process.stdout.write(arguments[i] + '\n');
        }
    }, 'unite.logger: Use devs.log instead');
    unite.logger.debug  = util.deprecate(function() {
        for (let i = 0, len = arguments.length; i < len; ++i) {
            process.stdout.write(arguments[i] + '\n');
        }
    }, 'unite.logger: Use devs.debug instead');
    unite.logger.error  = util.deprecate(function() {
        for (let i = 0, len = arguments.length; i < len; ++i) {
            process.stdout.write(arguments[i] + '\n');
        }
    }, 'unite.logger: Use devs.debug instead');


};