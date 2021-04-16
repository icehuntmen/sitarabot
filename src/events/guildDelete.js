module.exports = async (unite, guild) => {
    devs.log('Delete guild unite:Event')
    const { GuildsManager } = unite.unitebot
    const gm = new GuildsManager(unite,guild)

    try {
        await gm.onDeleteGuild();
    } catch (error) {
        devs.error(error);
    }
};