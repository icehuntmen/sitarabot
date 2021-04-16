const fs = require('fs')
const mongoose = require('mongoose');
const path  = require('path');
const basename  = path.basename(__filename);
const modelsCollection = {};
const Schema = mongoose.Schema;

/**
 * Создание Mongoose schemas
 * Перебираем файлы в папке ./models
 * @return {modelsCollection}
 */
fs.readdirSync(__dirname)
    .filter(fileName => {
        return (
            fileName.indexOf('.') !== 0) && (fileName !== basename) && (fileName.slice(-3) === '.js'
            );
    })
    .forEach(fileName => {

        let fileMain = fileName.split('.')[0];
        // Определяем название модели
        const model = require(path.join(__dirname, fileName));
        // Создаем модель
        const modelSchema = new Schema(model.schema);
        // Цепляем методы
        modelSchema.methods = model.methods;
        modelSchema.statics = model.statics;
        // Определяем название Коллекции в базе
        let collections = model.collections;
        // Собираем все схемы в один объект
        modelsCollection[fileMain + 'Schema'] = mongoose.model(collections, modelSchema);

    });


module.exports = modelsCollection;