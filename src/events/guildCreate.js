module.exports = async (unite, guild) => {

    const { GuildsManager } = unite.unitebot

    let GuildServer = new GuildsManager(unite,guild);

    try {

       await GuildServer.createGuild();
    } catch (error) {
       devs.error(error);
    }

};