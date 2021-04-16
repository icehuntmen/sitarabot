const { MessageEmbed, version: discordVersion } = require('discord.js');
const moment = require('moment');
const { version } = require('../../package.json');
const { noBotPerms } = require('../utils/errors');
require('moment-duration-format');

const colors = {
    red: '#FF4500'
};

module.exports = {
    name: 'stats',
    aliases: ['botstats', 'usage'],
    guildOnly: true,
    description: 'Display info about this roles.',
    async execute(message, unite, args, guild, guildReady) {
        if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')


        let perms = message.guild.me.permissions;
        if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

        const botUptime = moment.duration(unite.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guildSize = unite.guilds.cache.size;
        const userSize = unite.users.cache.size;

        const statsEmbed = new MessageEmbed()
            .setAuthor(unite.user.username, unite.user.avatarURL)
            .setColor(colors.red)
            .addField('Guilds', guildSize, true)
            .addField('Users', userSize, true)
            .addField('Uptime', botUptime, true)
            .addField('Memory', `${Math.round(memUsage)} MB`, true)
            .addField('Discord.js', `v${discordVersion}`, true)
            .addField('Node', `${process.version}`, true)
            .setFooter(`Bot Version: v${version}`)
            .setTimestamp();

        message.channel.send(statsEmbed);
    }
}