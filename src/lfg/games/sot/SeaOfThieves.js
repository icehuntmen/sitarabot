const {MessageEmbed} = require('discord.js')

class SeaOfThieves {
    constructor(message, unite) {
        Object.defineProperty(this, 'message', { value: message })
        Object.defineProperty(this, 'unite', { value: unite })
        const filter = (reaction, user) => ['🇵', '🇯', '🇸', '🇧', '🇬'].includes(reaction.emoji.name) && user.id === message.author.id
        this.filter = filter
    }
    startCreation() {
        this.message.channel.send("Welcome to LFG Post Program. Please reply with the specified information and I will create your LFG Post.\n" +
            "Please select the reaction corresponding to list of modes below:")
        this.FirstStep(this.message)
    }

    FirstStep(message){
        this.FirstEmbed = new MessageEmbed({
            color: 0x0099ff,
            description: 'PvP: 🇵\n'
                + 'Journey: 🇯'
        });

        message.channel.send(this.FirstEmbed).then(async msg => {
            await msg.react('🇵')
            await msg.react('🇯')
            msg.awaitReactions(this.filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {

                const reaction = collected.first()

                switch (reaction.emoji.name) {
                case '🇵':
                    msg.delete({ timeout: 100 }).then(() =>
                    this.SecondStep(message))
                    break;
                case '🇯':
                    msg.delete({ timeout: 100 }).then(() =>
                    this.SecondStep(message))
                    break;
                }
            }).catch(collected => {
                return message.channel.send("Time out!").then(msg => msg.delete({timeout: 1000}))
            });
        })


    }

    SecondStep(message){
        this.SecondEmbed = new MessageEmbed({
            color: 0x0099ff,
            description: 'Sloop: 🇸\n'
                + 'Brigantine: 🇧\n'
                + 'Galleon: 🇬'
        });
        message.channel.send(this.SecondEmbed).then(async msg => {
            await msg.react('🇸')
            await msg.react('🇧')
            await msg.react('🇬')

            msg.awaitReactions(this.filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {

                const reaction = collected.first()

                switch (reaction.emoji.name) {
                    case '🇸':
                        msg.delete({timeout: 100}).then(() =>
                            this.SecondStep(message))
                        break;
                    case '🇧':
                        msg.delete({timeout: 100}).then(() =>
                            this.SecondStep(message))
                        break;
                    case '🇬':
                        msg.delete({timeout: 100}).then(() =>
                            this.SecondStep(message))
                        break;
                }
            }).catch(collected => {
                msg.delete({timeout: 1000});
                return message.channel.send("Time out!")

            })
        })
    }
    saveData(){

    }
}

module.exports = SeaOfThieves;