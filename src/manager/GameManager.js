'use strict';

/**
 * Управление списками игр и игровыми платформами
 * @memberOf UBot.manager
 * @class GameManager
 * @param {UBot} unite
 */
class GameManager{
    constructor(unite) {

        Object.defineProperty(this, 'unite',{value: unite})
        Object.defineProperty(this, 'modelChannel',{value: unite})

    }
}

module.exports = GameManager