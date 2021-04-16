
module.exports = {
    name: 'config',
    description: "Settings",
    async execute(message, unite, args, guild, guildReady) {
        if(!guildReady) return message.reply('Активируйте гильдию **!setup init**')


        if (!message.member.hasPermission('ADMINISTRATOR')) return;

        devs.cmd('Config settings started',this.name)

        console.log(unite);

        let setting = args[0];
        let updated = args.slice(1).join(' ');

        switch (setting) {
            case 'prefix': {
                if (updated) {
                    try {
                        await unite.updateGuild(message.guild, {prefix: updated});
                        return message.channel.send(`Prefix has been updated to: \`${updated}\``);
                    } catch (error) {
                        console.error(error);
                        message.channel.send(`An error occurred: **${error.message}**`);
                    }
                }

                message.channel.send(`Current prefix: \`${settings.prefix}\``);
                break;
            }
            case 'start': {
                //devs.debug('Config settings')

                break;
            }
            case 'welcomeMsg': {
                /**
                 * Make sure the user specifically defines the {{user}} and {{guild}} parameters.
                 * Want a hint?
                 * ```js
                 * let foo = '{{bar}}';
                 * let message = 'Hello, {bar}';
                 *
                 * if (foo.test(message)) {
                 *  console.log('Wooo');
                 * } else {
                 *  console.log('No...');
                 * }
                 * ```
                 */

                break;
            }
            case 'modRole': {
                /**
                 * Make sure to do role validation? Need help? Refer to the "welcomeChannel" case statement above!
                 */

                break;
            }
            case 'adminRole': {
                /**
                 * Make sure to do role validation? Need help? Refer to the "welcomeChannel" case statement above!
                 */

                break;
            }
            default: {
                /**
                 * Want to go further? Use object destructuring to get the different properties from the MongoDB document
                 * and display them in the message below!
                 *
                 * Object desctructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
                 */

                message.channel.send(`Default settings: PLACEHOLDER`);
                break;
            }
        }
    }
}

