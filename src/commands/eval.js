
module.exports = {
    name: 'eval',
    description: '',
    async execute(message, unite, args, guild, guildReady) {
        if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')

        //if (message.author.id !== unite.config.owner) return;

        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            //devs.debug(evaled);
            message.channel.send(unite.clean(evaled), {code: "js"});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${unite.clean(err)}\n\`\`\``);
        }
    }

}

