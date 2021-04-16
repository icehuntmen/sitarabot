module.exports = async (unite, newGuild, oldGuild) => {
    devs.log(`Handler: on.guildUpdate start`)
    console.time(`[HANDLER]: on.guildUpdate time`)
    const { GuildsManager } = unite.unitebot;
    const serverGuild = new GuildsManager(unite,oldGuild);
    if(await serverGuild.isExist){
        await serverGuild.onGuildUpdate(oldGuild,newGuild);
    }else {
        devs.warn('No exist in base',[oldGuild.name,oldGuild.id])
    }
    console.timeEnd(`[HANDLER]: on.guildUpdate time`)
};