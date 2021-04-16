module.exports = async (unite, messageReaction, user) => {

    devs.info(`ReactionAdd events - ${messageReaction.message.id}- content ${messageReaction.message.content} = ${messageReaction._emoji}`)
    //devs.showObject(messageReaction,0)
    //devs.info('ReactionAdd events end!')
    /*
    const message = messageReaction.message;
    const welcomeChannel = message.guild.channels.cache.find(c => c.name === 'test01');
    const verifyChannel = message.guild.channels.cache.find(c => c.name === 'Инфо');
    const member = message.guild.members.cache.get(user.id);
    if (member.user.bot) return;

    const a = message.guild.roles.cache.get('729273555639861279'); // Moderator
    const b = message.guild.roles.cache.get('732241831357841488'); // Administrator
    const c = message.guild.roles.cache.get('732242092847530135'); // Developer

    const verify = message.guild.roles.cache.get('729273647587524658'); // Verified

    // Verify a member once they have reacted to the message in the verify channel (gives them the Verified role)
    if (messageReaction.emoji.name === '✅' && message.channel.id === verifyChannel.id) {
        member.roles.add(verify).catch(console.error);
        return messageReaction.remove(member).catch(console.error);
    }
*/
    // Adds/removes a user from a joinable role via the welcome
    const message = messageReaction.message;
    const member = message.guild.members.cache.get(user.id);

    if (['🇦', '🇧', '◀️'].includes(messageReaction.emoji.name)) {
        switch (messageReaction.emoji.name) {
            case '🇦':
                member.roles.add(a).catch(console.error);
                break;
            case '🇧':
                member.roles.add(b).catch(console.error);
                break;
            case '◀️':

                //devs.showObject(messageReaction,1)
                break;
            default:
                break;
        }
        return;
    }

};