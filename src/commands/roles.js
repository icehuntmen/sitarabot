const { MessageEmbed } = require('discord.js');

module.exports =  {
    name: 'roles',
    guildOnly: true,
    description: 'Display info about this roles.',
    async execute(message, unite, args, guild, guildReady) {
        if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')



        const a = message.guild.roles.cache.get('729273555639861279'); // Moderator
        const b = message.guild.roles.cache.get('732241831357841488'); // Administrator
        const c = message.guild.roles.cache.get('732242092847530135'); // Developer

        const filter = (reaction, user) => ['🇦', '🇧', '🇨'].includes(reaction.emoji.name) && user.id === message.author.id;

        const embed = new MessageEmbed()
            .setTitle('Avaiilable Roles')
            .setDescription(`
        
        🇦 ${a}
        🇧 ${b}
        🇨 ${c}

        `)
            .setColor(0xdd9323)
            .setFooter(`ID: ${message.author.id}`);

        message.channel.send(embed).then(async msg => {

            await msg.react('🇦');
            await msg.react('🇧');
            await msg.react('🇨');

            msg.awaitReactions(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {

                const reaction = collected.first();

                switch (reaction.emoji.name) {
                    case '🇦':


                        console.log(a.id)

                        if (message.member.roles.cache.some(r => r.id === a.id)) {
                            msg.delete({ timeout: 3000 });

                            return message.channel.send('You are already in this role!').then(m => m.delete({ timeout: 3000 }));
                        }
                        message.member.roles.add(a).catch(err => {
                            console.log(err);
                            return message.channel.send(`Error adding you to this role: **${err.message}**.`);
                        });
                        message.channel.send(`You have been added to the **${a.name}** role!`).then(m => m.delete(3000));
                        msg.delete();
                        break;
                    case '🇧':
                        if (message.member.roles.cache.some(r => r.id === b.id)) {
                            msg.delete(2000);
                            return message.channel.send('You are already in this role!').then(m => m.delete(3000));
                        }
                        message.member.roles.add(b).catch(err => {
                            console.log(err);
                            return message.channel.send(`Error adding you to this role: **${err.message}**.`);
                        });
                        message.channel.send(`You have been added to the **${b.name}** role!`).then(m => m.delete(3000));
                        msg.delete();
                        break;
                    case '🇨':
                        if (message.member.roles.cache.some(r => r.id === c.id)) {
                            msg.delete(2000);
                            return message.channel.send('You are already in this role!').then(m => m.delete(3000));
                        }
                        message.member.roles.add(c).catch(err => {
                            console.log(err);
                            return message.channel.send(`Error adding you to this role: **${err.message}**.`);
                        });
                        message.channel.send(`You have been added to the **${c.name}** role!`).then(m => m.delete(3000));
                        msg.delete();
                        break;
                }
            }).catch(collected => {
                return message.channel.send(`I couldn't add you to this role!`);
            });

        });


  }
}