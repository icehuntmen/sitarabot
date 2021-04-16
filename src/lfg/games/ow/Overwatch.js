const {MessageEmbed} = require('discord.js')

class Overwatch {
    constructor(message, unite) {
        Object.defineProperty(this, 'message', {value: message})
        Object.defineProperty(this, 'unite', {value: unite})
    }
}
module.exports = Overwatch