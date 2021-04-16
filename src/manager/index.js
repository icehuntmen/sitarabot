const fs = require('fs')
const path  = require('path');
const basename  = path.basename(__filename);
const manager = {}
/**
 * @category Manager
 */

fs.readdirSync(__dirname)
    .filter(fileName => {
        return (
            fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js'
        );
    })
    .forEach(fileName => {

        let fileMain = fileName.split('.')[0];
        const classModel = require(path.join(__dirname, fileName));

        manager[fileMain] = classModel;

    });
module.exports = manager;


