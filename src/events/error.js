module.exports = (unite, error) => {
    devs.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, 'error');
};