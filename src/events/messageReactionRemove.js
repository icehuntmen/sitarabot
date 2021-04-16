module.exports = async (unite, messageReaction, user) => {

    const message = messageReaction.message;
    const channel = message.guild.channels.cache.find(c => c.name === 'test01');
    const member = message.guild.members.cache.get(user.id);
    if (member.user.bot) return;

    const a = message.guild.roles.cache.get('729273555639861279'); // Moderator
    const b = message.guild.roles.cache.get('732241831357841488'); // Administrator
    const c = message.guild.roles.cache.get('732242092847530135'); // Developer

    if (['🇦', '🇧', '🇨'].includes(messageReaction.emoji.name) && message.channel.id === channel.id) {
        switch (messageReaction.emoji.name) {
            case '🇦':
                member.roles.add(a).catch(console.error);
                break;
            case '🇧':
                member.roles.add(b).catch(console.error);
                break;
            case '🇨':
                member.roles.add(c).catch(console.error);
                break;
            default:
                break;
        }
    }
};