const EventEmitter = require('events')

global.ee = new EventEmitter()

/**
 * Обработчик события в {unite}
 * При удачном запуске бота активируется обработчик ready
 * @event unite.ready
 * @param {UBot} unite  активиреутся как unite.on('ready')
 * @return {Promise<*>}
 * @type {UBot}
 */
module.exports = (unite) => {

    // Консольная таблица с показам активности бота
    //unite.setup.show()
    //devs.showObject(unite,1)


/*
    notifier.notify(
        {
            title: unite.user.tag,
            message: 'Бот в активном состоянии.\nХакнем планету!',
            icon: pathImages + 'sitara.png',
            timeout: 5,
            closeLabel: 'Ой все!',
            actions: 'Понял тыковка',
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        },

        function (err, response) {
            devs.info(response)
        }
    );
    notifier.on('click', function (notifierObject, options, event) {
        devs.showObject(notifierObject,'onclick')
        devs.showObject(options,'onclick')
        devs.showObject(event,'onclick')
    });

    notifier.on('timeout', function (notifierObject, options) {
        // Triggers if `wait: true` and notification closes
    });
*/
    /**
     * Проверка роботоспособности бота, тут говорим что все загрузилос и готово работать
     */
    devs.point.succeed('readyBot', { text: `${unite.user.tag} is bot:${unite.user.bot} status Ready! #${unite.user.id}` });
    devs.point.succeed('eventList', { text: `${unite.user.tag} uploaded a sheet of events...` ,color: 'magenta'});
    devs.point.succeed('embedList', { text: `${unite.user.tag} uploaded a list of amazing embeds fields...` ,color: 'magenta'});
    devs.point.succeed('commandList', { text: `${unite.user.tag} wait command in discord...`,color: 'magenta' });

    // Выполняем команду вывода таблички
    //unite.showStatus()

};
