require('dotenv-flow').config();

module.exports = {
    init: () => {
        process.on('warning', (warning) => {
            devs.warn(warning.name);    // Print the warning name
            devs.warn(warning.message); // Print the warning message
            devs.warn(warning.stack);   // Print the stack trace
        });
    },

    //prefix: process.env.PREFIX,
    //owner: process.env.OWNER,
    //embedColor: process.env.DEFAULT_COLOR,
    //discord: process.env.DISCORD,
    //invite: process.env.INVITE

};