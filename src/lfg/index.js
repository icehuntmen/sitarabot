const fs = require('fs')
const path  = require('path');
const basename  = path.basename(__filename);
const publicEvent = {}
const gamesEvent = {}


function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

/**
 * @name lfg.publicEvent
 * @type {object}
 */
let publicDir = path.join(__dirname, 'public')
/**
 * @name lfg.gamesEvent
 * @type {object}
 */
let gamesDir = path.join(__dirname, 'games')

    fs.readdirSync(publicDir)
        .filter(fileName => {
            return (
                fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js'
            );
        })
        .forEach(fileName => {

            let fileMain = fileName.split('.')[0];
            const classModel = require(path.join(publicDir, fileName));

            publicEvent[fileMain] = classModel;
        });


getDirectories(gamesDir).forEach(dirGame => {

    let tempGameDir = path.join(gamesDir, dirGame)

    fs.readdirSync(tempGameDir)
        .filter(fileName => {
            return (
                fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js'
            );
        })
        .forEach(fileName => {

            let fileMain = fileName.split('.')[0];
            const classModel = require(path.join(tempGameDir, fileName));

            gamesEvent[fileMain] = classModel;
        });

})

module.exports = {
    publicEvent,
    gamesEvent
}
