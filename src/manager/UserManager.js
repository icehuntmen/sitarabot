'use strict';

/**
 * @class
 * @memberOf UBot.manager
 */
class UserManager{
    constructor(unite) {

        Object.defineProperty(this, 'unite',{value: unite})
        Object.defineProperty(this, 'modelChannel',{value: unite})

    }


}

module.exports = UserManager