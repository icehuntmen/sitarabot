module.exports =  {
    name: 'statusEmbed',
    drawEmbed(guild, mongo) {

        const bots = guild.members.cache.find(bots => bots.user.bot === true).user
        const owner = guild.members.cache.get(guild.ownerID).user

        //const botUptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const channelSize = guild.channels.cache.size;
        const userSize = guild.members.cache.size;
        const rolesSize = guild.roles.cache.size;

        return {
            color: 0x0099ff,
            title: guild.name,
            url: 'https://discord.js.org',
            author: {
                name: `${owner.username} is OWNER`,
                icon_url: owner.avatarURL(),
                url: 'https://discord.js.org',
            },
            description: `Manager: ${bots.tag}`,
            thumbnail: {
                url: guild.iconURL(),
            },
            fields: [

                {
                    name: 'Channels',
                    value: channelSize,
                    inline: true,
                },
                {
                    name: 'Members',
                    value: userSize,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: rolesSize,
                    inline: true,
                },
                {
                    name: 'Mem Use',
                    value: memUsage,
                    inline: true,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: `Use Prefix commands: ${mongo.prefix}`,
                icon_url: bots.avatarURL(),
            }
         }
    }

}